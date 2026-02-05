 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
 
 interface CreateUserRequest {
   email: string;
   password: string;
   nome: string;
   cliente_id: string;
   role: 'admin' | 'user';
 }
 
 interface UpdateUserRequest {
   usuario_id: string;
   nome?: string;
   status?: 'ativo' | 'inativo';
   role?: 'admin' | 'user';
 }
 
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
     
     // Client with user's token for auth checks
     const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
       global: { headers: { Authorization: authHeader } },
     });
     
     // Admin client for user creation
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
 
     const url = new URL(req.url);
     const action = url.searchParams.get('action');
 
     if (req.method === 'POST' && action === 'create') {
       const body: CreateUserRequest = await req.json();
       
       if (!body.email || !body.password || !body.nome || !body.cliente_id) {
         return new Response(
           JSON.stringify({ error: 'Missing required fields: email, password, nome, cliente_id' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Create user in Supabase Auth
       const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
         email: body.email.toLowerCase().trim(),
         password: body.password,
         email_confirm: true,
       });
 
       if (createAuthError || !authData.user) {
         console.error('[ManageUsers] Auth creation error:', createAuthError);
         return new Response(
           JSON.stringify({ error: createAuthError?.message || 'Failed to create auth user' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Create usuario record
       const { data: usuario, error: usuarioError } = await supabaseAdmin
         .from('usuarios')
         .insert({
           auth_user_id: authData.user.id,
           email: body.email.toLowerCase().trim(),
           nome: body.nome,
           cliente_id: body.cliente_id,
           status: 'ativo',
         })
         .select()
         .single();
 
       if (usuarioError || !usuario) {
         console.error('[ManageUsers] Usuario creation error:', usuarioError);
         // Rollback: delete auth user
         await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
         return new Response(
           JSON.stringify({ error: 'Failed to create usuario record' }),
           { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Assign role
       const { error: roleError } = await supabaseAdmin
         .from('user_roles')
         .insert({
           user_id: usuario.id,
           role: body.role || 'user',
         });
 
       if (roleError) {
         console.error('[ManageUsers] Role assignment error:', roleError);
       }
 
       console.info(`[ManageUsers] Created user: ${body.email} with role: ${body.role || 'user'}`);
 
       return new Response(
         JSON.stringify({ success: true, usuario }),
         { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     if (req.method === 'PUT' && action === 'update') {
       const body: UpdateUserRequest = await req.json();
       
       if (!body.usuario_id) {
         return new Response(
           JSON.stringify({ error: 'Missing usuario_id' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       const updates: Record<string, unknown> = {};
       if (body.nome) updates.nome = body.nome;
       if (body.status) updates.status = body.status;
 
       if (Object.keys(updates).length > 0) {
         const { error: updateError } = await supabaseAdmin
           .from('usuarios')
           .update(updates)
           .eq('id', body.usuario_id);
 
         if (updateError) {
           return new Response(
             JSON.stringify({ error: 'Failed to update usuario' }),
             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
           );
         }
       }
 
       if (body.role) {
         // Update role - delete old and insert new
         await supabaseAdmin
           .from('user_roles')
           .delete()
           .eq('user_id', body.usuario_id);
         
         await supabaseAdmin
           .from('user_roles')
           .insert({ user_id: body.usuario_id, role: body.role });
       }
 
       return new Response(
         JSON.stringify({ success: true }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     if (req.method === 'DELETE' && action === 'delete') {
       const { usuario_id } = await req.json();
       
       if (!usuario_id) {
         return new Response(
           JSON.stringify({ error: 'Missing usuario_id' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
       }
 
       // Get auth_user_id first
       const { data: usuario } = await supabaseAdmin
         .from('usuarios')
         .select('auth_user_id')
         .eq('id', usuario_id)
         .single();
 
       if (usuario?.auth_user_id) {
         // Delete from auth
         await supabaseAdmin.auth.admin.deleteUser(usuario.auth_user_id);
       }
 
       // Delete role and usuario
       await supabaseAdmin.from('user_roles').delete().eq('user_id', usuario_id);
       await supabaseAdmin.from('usuarios').delete().eq('id', usuario_id);
 
       return new Response(
         JSON.stringify({ success: true }),
         { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: 'Invalid action. Use ?action=create|update|delete' }),
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