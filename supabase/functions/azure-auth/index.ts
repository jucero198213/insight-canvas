import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v5.2.0/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AzureTokenPayload {
  oid: string; // Azure Object ID
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  sub: string;
  tid: string; // Tenant ID
  aud: string; // Audience (Client ID)
  iss: string; // Issuer
  exp: number;
  iat: number;
}

interface AuthRequest {
  action: "login" | "validate" | "logout" | "get-user";
  id_token?: string;
  access_token?: string;
  cliente_id?: string; // For first-time registration
}

// Cache for Azure AD public keys
let jwksCache: jose.JWTVerifyGetKey | null = null;
let jwksCacheTime = 0;
const JWKS_CACHE_TTL = 3600000; // 1 hour

async function getAzureJWKS(tenantId: string): Promise<jose.JWTVerifyGetKey> {
  const now = Date.now();
  if (jwksCache && now - jwksCacheTime < JWKS_CACHE_TTL) {
    return jwksCache;
  }

  const jwksUrl = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
  jwksCache = jose.createRemoteJWKSet(new URL(jwksUrl));
  jwksCacheTime = now;
  return jwksCache;
}

async function validateAzureToken(
  idToken: string,
  clientId: string,
  tenantId: string
): Promise<AzureTokenPayload> {
  console.log("Validating Azure token...");

  const jwks = await getAzureJWKS(tenantId);

  // Build expected issuer URLs (Azure can use either format)
  const expectedIssuers = [
    `https://login.microsoftonline.com/${tenantId}/v2.0`,
    `https://sts.windows.net/${tenantId}/`,
  ];

  try {
    const { payload } = await jose.jwtVerify(idToken, jwks, {
      audience: clientId,
      issuer: expectedIssuers,
    });

    console.log("Token validated successfully for user:", payload.oid);
    return payload as unknown as AzureTokenPayload;
  } catch (error: unknown) {
    console.error("Token validation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Token validation failed: ${errorMessage}`);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const AZURE_CLIENT_ID = Deno.env.get("AZURE_ENTRA_CLIENT_ID");
    const AZURE_TENANT_ID = Deno.env.get("AZURE_ENTRA_TENANT_ID");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    if (!AZURE_CLIENT_ID || !AZURE_TENANT_ID) {
      throw new Error("Missing Azure Entra configuration");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body: AuthRequest = await req.json();
    console.log("Auth request action:", body.action);

    switch (body.action) {
      case "login": {
        if (!body.id_token) {
          throw new Error("ID token is required for login");
        }

        // Validate the Azure token
        const azurePayload = await validateAzureToken(
          body.id_token,
          AZURE_CLIENT_ID,
          AZURE_TENANT_ID
        );

        const email =
          azurePayload.email ||
          azurePayload.preferred_username ||
          `${azurePayload.oid}@azure.local`;
        const name =
          azurePayload.name ||
          `${azurePayload.given_name || ""} ${azurePayload.family_name || ""}`.trim() ||
          "Usuário";

        console.log("Looking up user by Azure OID:", azurePayload.oid);

        // Check if user exists in usuarios table by Azure OID
        const { data: existingUsuario, error: lookupError } = await supabaseAdmin
          .from("usuarios")
          .select("*, user_roles(*), clientes(*)")
          .eq("azure_oid", azurePayload.oid)
          .single();

        if (lookupError && lookupError.code !== "PGRST116") {
          console.error("Error looking up user:", lookupError);
          throw new Error("Failed to lookup user");
        }

        if (existingUsuario) {
          // User exists - check if active
          if (existingUsuario.status !== "ativo") {
            throw new Error("Usuário inativo. Entre em contato com o administrador.");
          }

          if (existingUsuario.clientes?.status !== "ativo") {
            throw new Error("Cliente inativo. Entre em contato com o suporte.");
          }

          // Check if auth.users record exists
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
            existingUsuario.auth_user_id
          );

          let sessionToken: string;

          if (authUser?.user) {
            // Generate a session for existing user
            const { data: session, error: sessionError } =
              await supabaseAdmin.auth.admin.generateLink({
                type: "magiclink",
                email: existingUsuario.email,
              });

            if (sessionError) {
              console.error("Error generating session:", sessionError);
              throw new Error("Failed to create session");
            }

            // Create a custom session
            const { data: signInData, error: signInError } =
              await supabaseAdmin.auth.signInWithPassword({
                email: existingUsuario.email,
                password: azurePayload.oid, // Use OID as password (set during user creation)
              });

            if (signInError) {
              console.error("Sign in error:", signInError);
              // Try to update password and retry
              await supabaseAdmin.auth.admin.updateUserById(existingUsuario.auth_user_id, {
                password: azurePayload.oid,
              });

              const { data: retryData, error: retryError } =
                await supabaseAdmin.auth.signInWithPassword({
                  email: existingUsuario.email,
                  password: azurePayload.oid,
                });

              if (retryError) throw new Error("Failed to authenticate user");
              sessionToken = retryData.session?.access_token || "";
            } else {
              sessionToken = signInData.session?.access_token || "";
            }
          } else {
            throw new Error("Auth user not found. Please contact support.");
          }

          const roles = existingUsuario.user_roles?.map((r: { role: string }) => r.role) || [];
          const isAdmin = roles.includes("admin");

          console.log("User authenticated successfully:", existingUsuario.id);

          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: existingUsuario.id,
                email: existingUsuario.email,
                nome: existingUsuario.nome,
                cliente_id: existingUsuario.cliente_id,
                cliente_nome: existingUsuario.clientes?.nome,
                roles,
                is_admin: isAdmin,
              },
              session_token: sessionToken,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // New user - requires cliente_id for registration
        if (!body.cliente_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "registration_required",
              message:
                "Usuário não encontrado. Entre em contato com o administrador para ser registrado.",
              azure_oid: azurePayload.oid,
              email,
              name,
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Verify cliente exists and is active
        const { data: cliente, error: clienteError } = await supabaseAdmin
          .from("clientes")
          .select("*")
          .eq("id", body.cliente_id)
          .eq("status", "ativo")
          .single();

        if (clienteError || !cliente) {
          throw new Error("Cliente não encontrado ou inativo");
        }

        // Create auth.users record
        const { data: newAuthUser, error: createAuthError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            password: azurePayload.oid,
            email_confirm: true,
            user_metadata: {
              azure_oid: azurePayload.oid,
              name,
            },
          });

        if (createAuthError) {
          console.error("Error creating auth user:", createAuthError);
          throw new Error("Failed to create user account");
        }

        // Create usuarios record
        const { data: newUsuario, error: usuarioError } = await supabaseAdmin
          .from("usuarios")
          .insert({
            auth_user_id: newAuthUser.user.id,
            cliente_id: body.cliente_id,
            email,
            nome: name,
            azure_oid: azurePayload.oid,
            status: "ativo",
          })
          .select()
          .single();

        if (usuarioError) {
          console.error("Error creating usuario:", usuarioError);
          // Rollback auth user
          await supabaseAdmin.auth.admin.deleteUser(newAuthUser.user.id);
          throw new Error("Failed to create user record");
        }

        // Assign default 'user' role
        await supabaseAdmin.from("user_roles").insert({
          user_id: newUsuario.id,
          role: "user",
        });

        // Create profile
        await supabaseAdmin.from("profiles").insert({
          user_id: newUsuario.id,
          display_name: name,
        });

        // Sign in the new user
        const { data: signInData } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password: azurePayload.oid,
        });

        console.log("New user created and authenticated:", newUsuario.id);

        return new Response(
          JSON.stringify({
            success: true,
            user: {
              id: newUsuario.id,
              email: newUsuario.email,
              nome: newUsuario.nome,
              cliente_id: newUsuario.cliente_id,
              cliente_nome: cliente.nome,
              roles: ["user"],
              is_admin: false,
            },
            session_token: signInData?.session?.access_token || "",
            is_new_user: true,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "validate": {
        // Validate an existing Supabase session and return user info
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          throw new Error("No authorization header");
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: claims, error: claimsError } =
          await supabaseAdmin.auth.getClaims(token);

        if (claimsError || !claims?.claims) {
          throw new Error("Invalid session token");
        }

        const authUserId = claims.claims.sub;

        const { data: usuario, error: usuarioError } = await supabaseAdmin
          .from("usuarios")
          .select("*, user_roles(*), clientes(*)")
          .eq("auth_user_id", authUserId)
          .single();

        if (usuarioError || !usuario) {
          throw new Error("User not found");
        }

        const roles = usuario.user_roles?.map((r: { role: string }) => r.role) || [];

        return new Response(
          JSON.stringify({
            success: true,
            user: {
              id: usuario.id,
              email: usuario.email,
              nome: usuario.nome,
              cliente_id: usuario.cliente_id,
              cliente_nome: usuario.clientes?.nome,
              roles,
              is_admin: roles.includes("admin"),
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "get-user": {
        // Get user info from Supabase session
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response(
            JSON.stringify({ success: false, user: null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: claims, error: claimsError } =
          await supabaseAdmin.auth.getClaims(token);

        if (claimsError || !claims?.claims) {
          return new Response(
            JSON.stringify({ success: false, user: null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const authUserId = claims.claims.sub;

        const { data: usuario } = await supabaseAdmin
          .from("usuarios")
          .select("*, user_roles(*), clientes(*)")
          .eq("auth_user_id", authUserId)
          .single();

        if (!usuario) {
          return new Response(
            JSON.stringify({ success: false, user: null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const roles = usuario.user_roles?.map((r: { role: string }) => r.role) || [];

        return new Response(
          JSON.stringify({
            success: true,
            user: {
              id: usuario.id,
              email: usuario.email,
              nome: usuario.nome,
              cliente_id: usuario.cliente_id,
              cliente_nome: usuario.clientes?.nome,
              roles,
              is_admin: roles.includes("admin"),
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      default:
        throw new Error(`Unknown action: ${body.action}`);
    }
  } catch (error: unknown) {
    console.error("Auth error:", error);
    const errorMessage = error instanceof Error ? error.message : "Authentication failed";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
