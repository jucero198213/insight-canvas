import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmbedTokenRequest {
  reportId: string;      // Power BI report_id
  datasetId?: string | null;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return jsonError('Missing authorization header', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 🔐 Identifica o usuário
    const { data: { user }, error: authError } =
      await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      console.error('[Auth]', authError);
      return jsonError('Unauthorized', 401);
    }

    const { reportId, datasetId }: EmbedTokenRequest = await req.json();
    if (!reportId) {
      return jsonError('Missing reportId', 400);
    }

    // 👤 Usuário interno
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id, cliente_id')
      .eq('auth_user_id', user.id)
      .eq('status', 'ativo')
      .single();

    if (!usuario) {
      return jsonError('User not registered', 403);
    }

    // 📄 Relatório
    const { data: relatorio } = await supabase
      .from('relatorios')
      .select('*')
      .eq('report_id', reportId)
      .eq('cliente_id', usuario.cliente_id)
      .eq('status', 'ativo')
      .single();

    if (!relatorio) {
      return jsonError('Report not found', 403);
    }

    // 🔐 Role
    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', usuario.id)
      .single();

    const isAdmin = roleRow?.role === 'admin';

    // 🔒 Permissão (se não for admin)
    if (!isAdmin) {
      const { data: permissao } = await supabase
        .from('permissoes')
        .select('id')
        .eq('usuario_id', usuario.id)
        .eq('relatorio_id', relatorio.id)
        .single();

      if (!permissao) {
        return jsonError('Access denied', 403);
      }
    }

    // 🔑 Token Azure
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[PowerBI Edge]', err);
    return jsonError(err.message || 'Internal server error', 500);
  }
});

function jsonError(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}
