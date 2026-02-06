import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmbedTokenRequest {
  reportId: string;
}

serve(async (req: Request): Promise<Response> => {
  console.log("========================================");
  console.log("[REQUEST] New request received");
  console.log("[REQUEST] Method:", req.method);
  console.log("[REQUEST] URL:", req.url);
  
  if (req.method === "OPTIONS") {
    console.log("[CORS] Handling OPTIONS preflight");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 🔍 LOG 1: Headers
    console.log("[HEADERS] All headers:");
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'authorization') {
        console.log(`  ${key}: ${value.substring(0, 20)}...`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      console.error("[AUTH] ❌ Missing Authorization header");
      return jsonError("Missing authorization header", 401);
    }

    console.log("[AUTH] ✅ Authorization header present");
    console.log("[AUTH] Token format:", authHeader.substring(0, 30) + "...");

    // 🔍 LOG 2: Environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    console.log("[ENV] SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
    console.log("[ENV] SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Set" : "❌ Missing");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    }

    // ✅ Criar cliente Supabase para autenticação
    console.log("[SUPABASE] Creating client with ANON_KEY...");
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // 🔍 LOG 3: Verificar usuário
    console.log("[AUTH] Calling getUser()...");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("[AUTH] ❌ getUser() error:", userError);
      console.error("[AUTH] Error details:", JSON.stringify(userError, null, 2));
      return jsonError(`Authentication failed: ${userError.message}`, 401);
    }

    if (!user) {
      console.error("[AUTH] ❌ No user returned from getUser()");
      return jsonError("No user found", 401);
    }

    console.log("[AUTH] ✅ User authenticated:", user.id);
    console.log("[AUTH] User email:", user.email);

    // 🔍 LOG 4: Request body
    const requestBody = await req.json();
    console.log("[BODY] Request body:", JSON.stringify(requestBody));

    const { reportId }: EmbedTokenRequest = requestBody;
    
    if (!reportId) {
      console.error("[BODY] ❌ Missing reportId in body");
      return jsonError("Missing reportId", 400);
    }

    console.log("[BODY] ✅ Report ID:", reportId);

    // 🔍 LOG 5: Admin client
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log("[ENV] SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅ Set" : "❌ Missing");

    if (!supabaseServiceKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 👤 Buscar usuário
    console.log("[DB] Querying usuarios table for auth_user_id:", user.id);
    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from("usuarios")
      .select("id, cliente_id")
      .eq("auth_user_id", user.id)
      .eq("status", "ativo")
      .single();

    if (usuarioError) {
      console.error("[DB] ❌ Error querying usuarios:", usuarioError);
      return jsonError(`User not found in database: ${usuarioError.message}`, 403);
    }

    if (!usuario) {
      console.error("[DB] ❌ No usuario record found");
      return jsonError("User not registered", 403);
    }

    console.log("[DB] ✅ Usuario found:", usuario.id, "cliente_id:", usuario.cliente_id);

    // 📄 Buscar relatório
    console.log("[DB] Querying relatorios table for id:", reportId);
    const { data: relatorio, error: relatorioError } = await supabaseAdmin
      .from("relatorios")
      .select("*")
      .eq("id", reportId)
      .eq("cliente_id", usuario.cliente_id)
      .eq("status", "ativo")
      .single();

    if (relatorioError) {
      console.error("[DB] ❌ Error querying relatorios:", relatorioError);
      return jsonError(`Report not found: ${relatorioError.message}`, 403);
    }

    if (!relatorio) {
      console.error("[DB] ❌ No relatorio record found");
      return jsonError("Report not found", 403);
    }

    console.log("[DB] ✅ Relatorio found:");
    console.log("  - nome:", relatorio.nome);
    console.log("  - report_id:", relatorio.report_id);
    console.log("  - dataset_id:", relatorio.dataset_id);

    // 🔐 Verificar permissões
    console.log("[PERMISSION] Checking user_roles...");
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", usuario.id)
      .single();

    const isAdmin = roleRow?.role === "admin";
    console.log("[PERMISSION] User role:", roleRow?.role || "none", "isAdmin:", isAdmin);

    if (!isAdmin) {
      console.log("[PERMISSION] Not admin, checking permissoes table...");
      const { data: permissao } = await supabaseAdmin
        .from("permissoes")
        .select("id")
        .eq("usuario_id", usuario.id)
        .eq("relatorio_id", relatorio.id)
        .single();

      if (!permissao) {
        console.error("[PERMISSION] ❌ Access denied - no permission");
        return jsonError("Access denied", 403);
      }

      console.log("[PERMISSION] ✅ Permission granted via permissoes table");
    } else {
      console.log("[PERMISSION] ✅ Admin access granted");
    }

    // 🔑 Power BI
    console.log("[POWERBI] Starting token generation...");
    const azureToken = await getAzureAccessToken();
    console.log("[POWERBI] Azure token obtained, generating embed token...");
    
    const embedData = await generateEmbedToken(
      azureToken,
      relatorio.report_id,
      relatorio.dataset_id
    );

    console.log("[POWERBI] ✅ Embed token generated successfully");
    console.log("[RESPONSE] Sending success response");

    return new Response(
      JSON.stringify({
        success: true,
        ...embedData,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("[ERROR] ❌❌❌ Caught exception:", err);
    console.error("[ERROR] Stack trace:", err.stack);
    return jsonError(err.message || "Internal server error", 500);
  }
});

async function getAzureAccessToken(): Promise<string> {
  const tenantId = Deno.env.get("POWER_BI_TENANT_ID");
  const clientId = Deno.env.get("POWER_BI_CLIENT_ID");
  const clientSecret = Deno.env.get("POWER_BI_CLIENT_SECRET");

  console.log("[AZURE] Checking credentials...");
  console.log("[AZURE] POWER_BI_TENANT_ID:", tenantId ? "✅" : "❌");
  console.log("[AZURE] POWER_BI_CLIENT_ID:", clientId ? "✅" : "❌");
  console.log("[AZURE] POWER_BI_CLIENT_SECRET:", clientSecret ? "✅" : "❌");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Azure credentials");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://analysis.windows.net/powerbi/api/.default",
  });

  console.log("[AZURE] Requesting access token from:", tokenUrl);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[AZURE] ❌ Token request failed:", response.status, error);
    throw new Error(`Azure token failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("[AZURE] ✅ Access token obtained");
  return data.access_token;
}

async function generateEmbedToken(
  azureToken: string,
  reportId: string,
  datasetId: string | null
) {
  const workspaceId = Deno.env.get("POWER_BI_WORKSPACE_ID");
  
  console.log("[POWERBI] POWER_BI_WORKSPACE_ID:", workspaceId ? "✅" : "❌");

  if (!workspaceId) {
    throw new Error("Missing POWER_BI_WORKSPACE_ID");
  }

  console.log("[POWERBI] Report ID:", reportId);
  console.log("[POWERBI] Workspace ID:", workspaceId);
  console.log("[POWERBI] Dataset ID:", datasetId || "none");

  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`;
  const tokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;

  const tokenBody: any = {
    accessLevel: "View",
    allowSaveAs: false,
  };

  if (datasetId) {
    tokenBody.datasets = [{ id: datasetId }];
  }

  console.log("[POWERBI] Requesting embed token from Power BI API...");
  console.log("[POWERBI] Request body:", JSON.stringify(tokenBody));

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${azureToken}`,
    },
    body: JSON.stringify(tokenBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[POWERBI] ❌ Embed token failed:", response.status, error);
    throw new Error(`Power BI embed token failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("[POWERBI] ✅ Embed token generated");
  console.log("[POWERBI] Token expires at:", data.expiration);

  return {
    token: data.token,
    embedUrl: embedUrl,
    expiration: data.expiration,
  };
}

function jsonError(message: string, status = 400) {
  console.log(`[RESPONSE] Sending error: ${status} - ${message}`);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
}
