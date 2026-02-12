import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClientes, mockUsuarios, mockRelatorios } from '@/data/mockData';
import { toast } from 'sonner';

interface PermissaoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PermissaoFormModal({ open, onOpenChange, onSuccess }: PermissaoFormModalProps) {
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_usuario: '',
    id_relatorio: '',
  });

  // Filter users and reports based on selected client
  const filteredUsuarios = useMemo(() => {
    if (!formData.id_cliente) return [];
    return mockUsuarios.filter(u => u.id_cliente === formData.id_cliente);
  }, [formData.id_cliente]);

  const filteredRelatorios = useMemo(() => {
    if (!formData.id_cliente) return [];
    return mockRelatorios.filter(r => r.id_cliente === formData.id_cliente);
  }, [formData.id_cliente]);

  const handleClienteChange = (value: string) => {
    setFormData({ id_cliente: value, id_usuario: '', id_relatorio: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_cliente) {
      toast.error('Cliente é obrigatório');
      return;
    }
    if (!formData.id_usuario) {
      toast.error('Usuário é obrigatório');
      return;
    }
    if (!formData.id_relatorio) {
      toast.error('Relatório é obrigatório');
      return;
    }

    const usuario = mockUsuarios.find(u => u.id_usuario === formData.id_usuario);
    const relatorio = mockRelatorios.find(r => r.id_relatorio === formData.id_relatorio);

    // Mock: In production, this would save to database
    toast.success(`Permissão concedida: ${usuario?.nome} → ${relatorio?.nome_relatorio}`);
    onOpenChange(false);
    setFormData({ id_cliente: '', id_usuario: '', id_relatorio: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Permissão</DialogTitle>
          <DialogDescription>
            Vincule um usuário a um relatório Power BI.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id_cliente">Cliente (Tenant) *</Label>
            <Select 
              value={formData.id_cliente} 
              onValueChange={handleClienteChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente primeiro" />
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
            <Label htmlFor="id_usuario">Usuário *</Label>
            <Select 
              value={formData.id_usuario} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, id_usuario: value }))}
              disabled={!formData.id_cliente}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.id_cliente ? "Selecione o usuário" : "Selecione o cliente primeiro"} />
              </SelectTrigger>
              <SelectContent>
                {filteredUsuarios.map((usuario) => (
                  <SelectItem key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nome} ({usuario.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_relatorio">Relatório Power BI *</Label>
            <Select 
              value={formData.id_relatorio} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, id_relatorio: value }))}
              disabled={!formData.id_cliente}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.id_cliente ? "Selecione o relatório" : "Selecione o cliente primeiro"} />
              </SelectTrigger>
              <SelectContent>
                {filteredRelatorios.map((relatorio) => (
                  <SelectItem key={relatorio.id_relatorio} value={relatorio.id_relatorio}>
                    {relatorio.nome_relatorio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="hero">
              Conceder Permissão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
