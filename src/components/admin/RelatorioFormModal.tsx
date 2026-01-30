import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClientes } from '@/data/mockData';
import { toast } from 'sonner';

interface RelatorioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RelatorioFormModal({ open, onOpenChange }: RelatorioFormModalProps) {
  const [formData, setFormData] = useState({
    nome_relatorio: '',
    id_cliente: '',
    workspace_id: '',
    report_id: '',
    dataset_id: '',
    status: 'ativo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_relatorio.trim()) {
      toast.error('Nome do relatório é obrigatório');
      return;
    }
    if (!formData.id_cliente) {
      toast.error('Cliente é obrigatório');
      return;
    }
    if (!formData.workspace_id.trim()) {
      toast.error('Workspace ID é obrigatório');
      return;
    }
    if (!formData.report_id.trim()) {
      toast.error('Report ID é obrigatório');
      return;
    }

    // Mock: In production, this would save to database
    toast.success(`Relatório "${formData.nome_relatorio}" cadastrado com sucesso!`);
    onOpenChange(false);
    setFormData({ nome_relatorio: '', id_cliente: '', workspace_id: '', report_id: '', dataset_id: '', status: 'ativo' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Relatório Power BI</DialogTitle>
          <DialogDescription>
            Cadastre um novo relatório Power BI para embed.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_relatorio">Nome do Relatório *</Label>
            <Input
              id="nome_relatorio"
              value={formData.nome_relatorio}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_relatorio: e.target.value }))}
              placeholder="Ex: Dashboard de Vendas"
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
            <Label htmlFor="workspace_id">Workspace ID *</Label>
            <Input
              id="workspace_id"
              value={formData.workspace_id}
              onChange={(e) => setFormData(prev => ({ ...prev, workspace_id: e.target.value }))}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report_id">Report ID *</Label>
            <Input
              id="report_id"
              value={formData.report_id}
              onChange={(e) => setFormData(prev => ({ ...prev, report_id: e.target.value }))}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset ID</Label>
            <Input
              id="dataset_id"
              value={formData.dataset_id}
              onChange={(e) => setFormData(prev => ({ ...prev, dataset_id: e.target.value }))}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (opcional)"
              className="font-mono text-sm"
            />
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
              Cadastrar Relatório
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
