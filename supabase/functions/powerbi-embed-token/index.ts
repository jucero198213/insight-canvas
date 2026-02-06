import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/* ------------------------------------------------------------------ */
/* CORS                                                               */
/* ------------------------------------------------------------------ */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ------------------------------------------------------------------ */
/* TYPES                                                              */
/* ------------------------------------------------------------------ */
interface EmbedTokenRequest {
  reportId: string; // ID da tabela relatorios (UUID)
}

/* ------------------------------------------------------------------ */
/* AZURE AUTH                                                         */
/* ------------------------------------------------------------------ */
async function getAzureAccessToken(): Promise<string> {
  const tenantId = Deno.env.get("POWER_BI_TENANT_ID");
  const clientId = Deno.env.get("POWER_BI_CLIENT_ID");
  const clientSecret = Deno.env.get("POWER_BI_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure credentials not configured");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://analysis.windows.net/powerbi/api/.default",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure auth failed: ${err}`);
  }

  const json = await res.json();
  return json.access_token;
}

/* ------------------------------------------------------------------ */
/* POWER BI EMBED TOKEN                                               */
/* ------------------------------------------------------------------ */
async function generateEmbedToken(
  accessToken: string,
  workspaceId: string,
  reportId: string,
  datasetId: string | null
) {
  // 🔎 Busca embedUrl do relatório
  const reportUrl =
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;

  const reportRes = await fetch(reportUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!reportRes.ok) {
    const err = await reportRes.text();
    throw new Error(`Power BI report fetch failed: ${err}`);
  }

  const report = await reportRes.json();

  // 🔑 Gera token de embed
  const tokenRes = await fetch(
    "https://api.powerbi.com/v1.0/myorg/GenerateToken",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reports: [{ id: reportId }],
        datasets: datasetId ? [{ id: datasetId }] : [],
      }),
    }
  );

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Embed token generation failed: ${err}`);
  }

  const token = await tokenRes.json();

  return {
    token: token.token,
    embedUrl: report.embedUrl,
    expiration: token.expiration,
  };
}

/* ------------------------------------------------------------------ */
/* EDGE FUNCTION                                                      */
/* ------------------------------------------------------------------ */
serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    /* ---------------- AUTH HEADER ---------------- */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return jsonError("Missing authorization header", 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const jwt = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      return jsonError("Unauthorized", 401);
    }

    /* ---------------- BODY ---------------- */
    const { reportId }: EmbedTokenRequest = await req.json();
    if (!reportId) {
      return jsonError("Missing reportId", 400);
    }

    /* ---------------- USUÁRIO ---------------- */
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("id, cliente_id")
      .eq("auth_user_id", user.id)
      .eq("status", "ativo")
      .single();

    if (!usuario) {
      return jsonError("User not registered", 403);
    }

    /* ---------------- RELATÓRIO ---------------- */
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

    if (!relatorio.workspace_id) {
      return jsonError("Report workspace_id not configured", 500);
    }

    /* ---------------- ROLE ---------------- */
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", usuario.id)
      .single();

    const isAdmin = roleRow?.role === "admin";

    /* ---------------- PERMISSÃO ---------------- */
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

    /* ---------------- POWER BI ---------------- */
    const azureToken = await getAzureAccessToken();

    const embedData = await generateEmbedToken(
      azureToken,
      relatorio.workspace_id,
      relatorio.report_id,
      relatorio.dataset_id
    );

    return new Response(
      JSON.stringify({ success: true, ...embedData }),
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

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */
function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
