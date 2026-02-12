import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ClienteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ClienteFormModal({ open, onOpenChange, onSuccess }: ClienteFormModalProps) {
  const [formData, setFormData] = useState({
    nome_cliente: '',
    logo_url: '',
    cor_primaria: '#00A3E0',
    status: 'ativo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_cliente.trim()) {
      toast.error('Nome do cliente é obrigatório');
      return;
    }

    // Mock: In production, this would save to database
    toast.success(`Cliente "${formData.nome_cliente}" cadastrado com sucesso!`);
    onOpenChange(false);
    setFormData({ nome_cliente: '', logo_url: '', cor_primaria: '#00A3E0', status: 'ativo' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cliente (tenant) na plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_cliente">Nome do Cliente *</Label>
            <Input
              id="nome_cliente"
              value={formData.nome_cliente}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_cliente: e.target.value }))}
              placeholder="Ex: Empresa ABC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo (URL)</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor_primaria">Cor Principal</Label>
            <div className="flex gap-3">
              <Input
                id="cor_primaria"
                type="color"
                value={formData.cor_primaria}
                onChange={(e) => setFormData(prev => ({ ...prev, cor_primaria: e.target.value }))}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.cor_primaria}
                onChange={(e) => setFormData(prev => ({ ...prev, cor_primaria: e.target.value }))}
                placeholder="#00A3E0"
                className="flex-1 font-mono"
              />
            </div>
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
              Cadastrar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
