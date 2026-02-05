import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface EmbedTokenRequest {
  reportId: string;
}

interface EmbedTokenResponse {
  token: string;
  tokenId: string;
  expiration: string;
  embedUrl: string;
}

async function getAzureAccessToken(): Promise<string> {
  const tenantId = Deno.env.get('POWER_BI_TENANT_ID');
  const clientId = Deno.env.get('POWER_BI_CLIENT_ID');
  const clientSecret = Deno.env.get('POWER_BI_CLIENT_SECRET');

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Power BI credentials not configured');
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://analysis.windows.net/powerbi/api/.default',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PowerBI] Azure token error:', errorText);
    throw new Error('Failed to obtain Azure access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function generateEmbedToken(
  accessToken: string,
  reportId: string,
  datasetId: string | null
): Promise<EmbedTokenResponse> {

  const reportResponse = await fetch(
    `https://api.powerbi.com/v1.0/myorg/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!reportResponse.ok) {
    const errorText = await reportResponse.text();
    console.error('[PowerBI] Report fetch error:', errorText);
    throw new Error('Failed to fetch report details');
  }

  const reportDetails = await reportResponse.json();
  const embedUrl = reportDetails.embedUrl;

  const tokenBody: any = {
    reports: [{ id: reportId }],
    datasets: datasetId ? [{ id: datasetId }] : [{ id: reportDetails.datasetId }],
  };

  const tokenResponse = await fetch(
    'https://api.powerbi.com/v1.0/myorg/GenerateToken',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenBody),
    }
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('[PowerBI] Embed token error:', errorText);
    throw new Error('Failed to generate embed token');
  }

  const tokenData = await tokenResponse.json();

  return {
    token: tokenData.token,
    tokenId: tokenData.tokenId,
    expiration: tokenData.expiration,
    embedUrl,
  };
}

serve(async (req: Request): Promise<Response> => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 🔑 READ AUTH HEADER (lower + upper case)
    const authHeader =
      req.headers.get('authorization') ||
      req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // ✅ CORREÇÃO
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // ✅ AUTH VALIDATION
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[PowerBI] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { reportId }: EmbedTokenRequest = await req.json();

    if (!reportId) {
      return new Response(
        JSON.stringify({ error: 'Missing reportId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id, cliente_id')
      .eq('auth_user_id', user.id)
      .eq('status', 'ativo')
      .single();

    if (usuarioError || !usuario) {
      console.error('[PowerBI] Usuario not found:', usuarioError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: relatorio, error: relatorioError } = await supabase
      .from('relatorios')
      .select('id, report_id, dataset_id, cliente_id, nome')
      .eq('id', reportId)
      .eq('cliente_id', usuario.cliente_id)
      .eq('status', 'ativo')
      .single();

    if (relatorioError || !relatorio) {
      console.error('[PowerBI] Report not found or unauthorized:', relatorioError);
      return new Response(
        JSON.stringify({ error: 'Report not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin } = await supabase.rpc('is_current_user_admin');

    if (!isAdmin) {
      const { data: permissao, error: permissaoError } = await supabase
        .from('permissoes')
        .select('id')
        .eq('usuario_id', usuario.id)
        .eq('relatorio_id', reportId)
        .single();

      if (permissaoError || !permissao) {
        console.error('[PowerBI] Permission denied:', permissaoError);
        return new Response(
          JSON.stringify({ error: 'Access denied to this report' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.info(`[PowerBI] Generating embed token for report ${relatorio.nome}`);

    const accessToken = await getAzureAccessToken();
    const embedData = await generateEmbedToken(
      accessToken,
      relatorio.report_id,
      relatorio.dataset_id
    );

    console.info('[PowerBI] Embed token generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        ...embedData,
        reportName: relatorio.nome,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[PowerBI] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
