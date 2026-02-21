import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is admin
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin } = await supabaseUser.rpc('is_current_user_admin');
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const action = body.action || new URL(req.url).searchParams.get('action');

    // ========== CREATE ==========
    if (action === 'create') {
      if (!body.email || !body.nome || !body.cliente_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: email, nome, cliente_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate a random password if not provided
      const password = body.password || crypto.randomUUID().slice(0, 16) + 'Aa1!';

      const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: body.email.toLowerCase().trim(),
        password,
        email_confirm: true,
      });

      if (createAuthError || !authData.user) {
        console.error('[ManageUsers] Auth creation error:', createAuthError);
        return new Response(
          JSON.stringify({ error: createAuthError?.message || 'Failed to create auth user' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: usuario, error: usuarioError } = await supabaseAdmin
        .from('usuarios')
        .insert({
          auth_user_id: authData.user.id,
          email: body.email.toLowerCase().trim(),
          nome: body.nome,
          cliente_id: body.cliente_id,
          status: body.status || 'ativo',
        })
        .select()
        .single();

      if (usuarioError || !usuario) {
        console.error('[ManageUsers] Usuario creation error:', usuarioError);
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return new Response(
          JSON.stringify({ error: usuarioError?.message || 'Failed to create usuario record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: usuario.id, role: body.role || 'user' });

      if (roleError) {
        console.error('[ManageUsers] Role assignment error:', roleError);
      }

      console.info(`[ManageUsers] Created user: ${body.email}`);

      return new Response(
        JSON.stringify({ success: true, usuario }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========== UPDATE ==========
    if (action === 'update') {
      if (!body.usuario_id) {
        return new Response(
          JSON.stringify({ error: 'Missing usuario_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const updates: Record<string, unknown> = {};
      if (body.nome) updates.nome = body.nome;
      if (body.status) updates.status = body.status;
      if (body.email) updates.email = body.email;

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('usuarios')
          .update(updates)
          .eq('id', body.usuario_id);

        if (updateError) {
          return new Response(
            JSON.stringify({ error: 'Failed to update usuario: ' + updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      if (body.role) {
        await supabaseAdmin.from('user_roles').delete().eq('user_id', body.usuario_id);
        await supabaseAdmin.from('user_roles').insert({ user_id: body.usuario_id, role: body.role });
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========== DELETE ==========
    if (action === 'delete') {
      const usuario_id = body.usuario_id;
      if (!usuario_id) {
        return new Response(
          JSON.stringify({ error: 'Missing usuario_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: usuario } = await supabaseAdmin
        .from('usuarios')
        .select('auth_user_id')
        .eq('id', usuario_id)
        .single();

      // Delete related records first
      await supabaseAdmin.from('permissoes').delete().eq('usuario_id', usuario_id);
      await supabaseAdmin.from('user_roles').delete().eq('user_id', usuario_id);
      await supabaseAdmin.from('usuarios').delete().eq('id', usuario_id);

      if (usuario?.auth_user_id) {
        await supabaseAdmin.auth.admin.deleteUser(usuario.auth_user_id);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use action: create|update|delete' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[ManageUsers] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
