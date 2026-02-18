 import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { supabase } from '@/lib/safeSupabaseClient';
import { toast } from 'sonner';
 import { Loader2 } from 'lucide-react';

interface UsuarioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
 }
 
 interface Cliente {
   id: string;
   nome: string;
}

 export function UsuarioFormModal({ open, onOpenChange, onSuccess }: UsuarioFormModalProps) {
   const [clientes, setClientes] = useState<Cliente[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
     password: '',
     cliente_id: '',
    role: 'user',
  });

   useEffect(() => {
     if (open) {
       fetchClientes();
     }
   }, [open]);
 
   const fetchClientes = async () => {
     setIsLoading(true);
     try {
       const { data, error } = await supabase
         .from('clientes')
         .select('id, nome')
         .eq('status', 'ativo')
         .order('nome');
 
       if (error) {
         console.error('Error fetching clientes:', error);
         return;
       }
 
       setClientes(data || []);
     } catch (err) {
       console.error('Error:', err);
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('E-mail é obrigatório');
      return;
    }
     if (!formData.password || formData.password.length < 6) {
       toast.error('Senha deve ter no mínimo 6 caracteres');
       return;
     }
     if (!formData.cliente_id) {
      toast.error('Cliente é obrigatório');
      return;
    }

     setIsSubmitting(true);
     try {
       const response = await supabase.functions.invoke('manage-users', {
         body: {
           email: formData.email,
           password: formData.password,
           nome: formData.nome,
           cliente_id: formData.cliente_id,
           role: formData.role,
         },
       });
 
       if (response.error) {
         throw new Error(response.error.message);
       }
 
       if (response.data?.error) {
         throw new Error(response.data.error);
       }
 
       toast.success(`Usuário "${formData.nome}" cadastrado com sucesso!`);
       onOpenChange(false);
       setFormData({ nome: '', email: '', password: '', cliente_id: '', role: 'user' });
       onSuccess?.();
     } catch (err: unknown) {
       console.error('Error creating user:', err);
       const message = err instanceof Error ? err.message : 'Erro ao criar usuário';
       toast.error(message);
     } finally {
       setIsSubmitting(false);
     }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="usuario@empresa.com"
            />
          </div>

          <div className="space-y-2">
             <Label htmlFor="password">Senha *</Label>
             <Input
               id="password"
               type="password"
               value={formData.password}
               onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
               placeholder="Mínimo 6 caracteres"
             />
           </div>
 
           <div className="space-y-2">
            <Label htmlFor="id_cliente">Cliente (Tenant) *</Label>
            <Select 
               value={formData.cliente_id} 
               onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
               disabled={isLoading}
            >
              <SelectTrigger>
                 <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o cliente"} />
              </SelectTrigger>
              <SelectContent>
                 {clientes.map((cliente) => (
                   <SelectItem key={cliente.id} value={cliente.id}>
                     {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
             <Button type="submit" variant="hero" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
