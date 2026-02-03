-- Add workspace_id to clientes table for Power BI workspaces
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS workspace_id text;

-- Create relatorios table for Power BI reports
CREATE TABLE IF NOT EXISTS public.relatorios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  report_id text NOT NULL, -- Power BI report ID
  dataset_id text, -- Power BI dataset ID (optional)
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create permissoes table for user-report access control
CREATE TABLE IF NOT EXISTS public.permissoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  relatorio_id uuid NOT NULL REFERENCES public.relatorios(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, relatorio_id)
);

-- Enable RLS on new tables
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes ENABLE ROW LEVEL SECURITY;

-- RLS policies for relatorios
CREATE POLICY "Users can view reports from their tenant"
ON public.relatorios
FOR SELECT
USING (cliente_id = get_current_cliente_id());

CREATE POLICY "Admins can manage reports in their tenant"
ON public.relatorios
FOR ALL
USING (cliente_id = get_current_cliente_id() AND is_current_user_admin());

-- RLS policies for permissoes
CREATE POLICY "Users can view their own permissions"
ON public.permissoes
FOR SELECT
USING (usuario_id = get_current_usuario_id());

CREATE POLICY "Admins can manage permissions in their tenant"
ON public.permissoes
FOR ALL
USING (
  is_current_user_admin() AND 
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = usuario_id 
    AND u.cliente_id = get_current_cliente_id()
  )
);

-- Trigger for updated_at on relatorios
CREATE TRIGGER update_relatorios_updated_at
BEFORE UPDATE ON public.relatorios
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Add realtime for relatorios
ALTER PUBLICATION supabase_realtime ADD TABLE public.relatorios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.permissoes;