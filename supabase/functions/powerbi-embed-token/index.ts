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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader =
      req.headers.get("authorization") ||
      req.headers.get("Authorization");

    if (!authHeader) {
      return jsonError("Missing authorization header", 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[Auth]", authError);
      return jsonError("Unauthorized", 401);
    }

    const { reportId }: EmbedTokenRequest = await req.json();
    if (!reportId) {
      return jsonError("Missing reportId", 400);
    }

    // 👤 Usuário interno
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("id, cliente_id")
      .eq("auth_user_id", user.id)
      .eq("status", "ativo")
      .single();

    if (!usuario) {
      return jsonError("User not registered", 403);
    }

    // 📄 Relatório
    const { data: relatorio } = await supabase
      .from("relatorios")
      .select("*")
      .eq("id", reportId)
      .eq("cliente_id", usuario.cliente_id)
      .eq("status", "ativo")
      .single();

    if (!relatorio) {
      return jsonError("Report not found", 403);
    }

    // 🔐 Role
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", usuario.id)
      .single();

    const isAdmin = roleRow?.role === "admin";

    if (!isAdmin) {
      const { data: permissao } = await supabase
        .from("permissoes")
        .select("id")
        .eq("usuario_id", usuario.id)
        .eq("relatorio_id", relatorio.id)
        .single();

      if (!permissao) {
        return jsonError("Access denied", 403);
      }
    }

    // 🔑 Power BI - Gerar token de embed
    console.log(`[PowerBI] Generating embed token for report: ${relatorio.report_id}`);
    
    const azureToken = await getAzureAccessToken();
    const embedData = await generateEmbedToken(
      azureToken,
      relatorio.report_id,
      relatorio.dataset_id
    );

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
    console.error("[PowerBI Edge]", err);
    return jsonError(err.message || "Internal server error", 500);
  }
});

// ========================================
// 🔑 Funções de autenticação Azure/Power BI
// ========================================

async function getAzureAccessToken(): Promise<string> {
  // ✅ Usando os nomes CORRETOS dos secrets que você configurou
  const tenantId = Deno.env.get("POWER_BI_TENANT_ID");
  const clientId = Deno.env.get("POWER_BI_CLIENT_ID");
  const clientSecret = Deno.env.get("POWER_BI_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Missing Azure credentials. Required: POWER_BI_TENANT_ID, POWER_BI_CLIENT_ID, POWER_BI_CLIENT_SECRET"
    );
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://analysis.windows.net/powerbi/api/.default",
  });

  console.log("[Azure] Requesting access token...");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[Azure Token Error]", error);
    throw new Error(
      `Failed to get Azure access token: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("[Azure] Access token obtained successfully");
  return data.access_token;
}

async function generateEmbedToken(
  azureToken: string,
  reportId: string,
  datasetId: string | null
) {
  const workspaceId = Deno.env.get("POWER_BI_WORKSPACE_ID");
  
  if (!workspaceId) {
    throw new Error(
      "Missing POWER_BI_WORKSPACE_ID environment variable. Please add it in Supabase Secrets."
    );
  }

  console.log(`[PowerBI] Generating embed token for report: ${reportId} in workspace: ${workspaceId}`);

  // 1. Embed URL
  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`;

  // 2. Generate embed token via Power BI REST API
  const tokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;

  const tokenBody: any = {
    accessLevel: "View",
    allowSaveAs: false,
  };

  // Incluir dataset se disponível
  if (datasetId) {
    tokenBody.datasets = [{ id: datasetId }];
  }

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
    console.error("[PowerBI Embed Token Error]", error);
    throw new Error(
      `Failed to generate Power BI embed token: ${response.status} ${response.statusText}. Error: ${error}`
    );
  }

  const data = await response.json();

  console.log("[PowerBI] Embed token generated successfully");
  console.log(`[PowerBI] Token expires at: ${data.expiration}`);

  return {
    token: data.token,
    embedUrl: embedUrl,
    expiration: data.expiration,
  };
}

function jsonError(message: string, status = 400) {
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
