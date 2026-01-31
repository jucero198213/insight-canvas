-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create clientes table (tenants)
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  logo_url TEXT,
  cor_primaria TEXT DEFAULT '#0d3b66',
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usuarios table (maps auth.users to tenants)
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  azure_oid TEXT, -- Azure Object ID for mapping
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (RBAC)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table (additional user data)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function: Get current user's usuario record
CREATE OR REPLACE FUNCTION public.get_current_usuario_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.usuarios WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Helper function: Get current user's cliente_id
CREATE OR REPLACE FUNCTION public.get_current_cliente_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cliente_id FROM public.usuarios WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Helper function: Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.usuarios u ON ur.user_id = u.id
    WHERE u.auth_user_id = auth.uid() AND ur.role = 'admin'
  )
$$;

-- Helper function: Check if target user belongs to same tenant as current user
CREATE OR REPLACE FUNCTION public.is_same_tenant(_target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios target
    WHERE target.id = _target_user_id
    AND target.cliente_id = public.get_current_cliente_id()
  )
$$;

-- RLS Policies for clientes
CREATE POLICY "Users can view their own tenant"
ON public.clientes FOR SELECT
USING (id = public.get_current_cliente_id());

-- RLS Policies for usuarios
CREATE POLICY "Users can view their own record"
ON public.usuarios FOR SELECT
USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all users in their tenant"
ON public.usuarios FOR SELECT
USING (
  cliente_id = public.get_current_cliente_id()
  AND public.is_current_user_admin()
);

CREATE POLICY "Users can update their own record"
ON public.usuarios FOR UPDATE
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = public.get_current_usuario_id());

CREATE POLICY "Admins can view roles in their tenant"
ON public.user_roles FOR SELECT
USING (
  public.is_same_tenant(user_id)
  AND public.is_current_user_admin()
);

CREATE POLICY "Admins can manage roles in their tenant"
ON public.user_roles FOR ALL
USING (
  public.is_same_tenant(user_id)
  AND public.is_current_user_admin()
  AND user_id != public.get_current_usuario_id()
);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = public.get_current_usuario_id());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = public.get_current_usuario_id());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = public.get_current_usuario_id())
WITH CHECK (user_id = public.get_current_usuario_id());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER set_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX idx_usuarios_auth_user_id ON public.usuarios(auth_user_id);
CREATE INDEX idx_usuarios_cliente_id ON public.usuarios(cliente_id);
CREATE INDEX idx_usuarios_azure_oid ON public.usuarios(azure_oid);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);