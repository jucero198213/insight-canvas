import { BarChart3, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Relatorio {
  id: string;
  nome: string;
  descricao: string | null;
  report_id: string;
  dataset_id: string | null;
  cliente_id: string;
  status: string;
}

interface ReportCardProps {
  report: Relatorio;
  onOpen: (report: Relatorio) => void;
}

export function ReportCard({ report, onOpen }: ReportCardProps) {
  return (
    <div className="group p-6 rounded-2xl glass-card hover:shadow-elevated transition-all duration-300 animate-scale-in hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <BarChart3 className="w-7 h-7 text-accent" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          report.status === 'ativo' 
            ? 'bg-success/10 text-success' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {report.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
        {report.nome}
      </h3>
      
      {report.descricao && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {report.descricao}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Clock className="w-3.5 h-3.5" />
        <span>Atualizado recentemente</span>
      </div>

      <Button 
        variant="accent" 
        className="w-full"
        onClick={() => onOpen(report)}
      >
        Abrir Relatório
        <ExternalLink className="w-4 h-4" />
      </Button>
    </div>
  );
}
