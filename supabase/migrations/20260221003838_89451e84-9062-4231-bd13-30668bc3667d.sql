
-- CLIENTES: Allow admin to INSERT, UPDATE, DELETE
CREATE POLICY "admin_insert_clientes"
ON public.clientes FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_update_clientes"
ON public.clientes FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_delete_clientes"
ON public.clientes FOR DELETE
TO authenticated
USING (is_current_user_admin());

-- USUARIOS: Allow admin to INSERT, UPDATE, DELETE users in their tenant
CREATE POLICY "admin_insert_usuarios"
ON public.usuarios FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_update_usuarios"
ON public.usuarios FOR UPDATE
TO authenticated
USING (cliente_id = get_current_cliente_id() AND is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_delete_usuarios"
ON public.usuarios FOR DELETE
TO authenticated
USING (cliente_id = get_current_cliente_id() AND is_current_user_admin());

-- RELATORIOS: Allow admin to INSERT, UPDATE, DELETE
CREATE POLICY "admin_insert_relatorios"
ON public.relatorios FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_update_relatorios"
ON public.relatorios FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "admin_delete_relatorios"
ON public.relatorios FOR DELETE
TO authenticated
USING (is_current_user_admin());
