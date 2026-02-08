import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Relatorio {
  id: string;
  nome: string;
  descricao: string | null;
}

interface PowerBIEmbedProps {
  report: Relatorio;
  onClose: () => void;
}

export function PowerBIEmbed({ report, onClose }: PowerBIEmbedProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div>
          <h2 className="text-xl font-semibold">{report.nome}</h2>
          {report.descricao && (
            <p className="text-sm text-muted-foreground">{report.descricao}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* IFRAME */}
      <div className="flex-1">
        <iframe
          title={report.nome}
          src="https://analyticspro.com.br/embed/financeiro"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
