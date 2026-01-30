import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClientes } from '@/data/mockData';
import { toast } from 'sonner';

interface UsuarioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsuarioFormModal({ open, onOpenChange }: UsuarioFormModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    id_cliente: '',
    role: 'user',
    status: 'ativo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('E-mail é obrigatório');
      return;
    }
    if (!formData.id_cliente) {
      toast.error('Cliente é obrigatório');
      return;
    }

    // Mock: In production, this would save to database
    toast.success(`Usuário "${formData.nome}" cadastrado com sucesso!`);
    onOpenChange(false);
    setFormData({ nome: '', email: '', id_cliente: '', role: 'user', status: 'ativo' });
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
            <Label htmlFor="id_cliente">Cliente (Tenant) *</Label>
            <Select 
              value={formData.id_cliente} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, id_cliente: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClientes.map((cliente) => (
                  <SelectItem key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nome_cliente}
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="hero">
              Cadastrar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
