import { RelatorioPowerBI } from '@/types';
import { X, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PowerBIEmbedProps {
  report: RelatorioPowerBI;
  onClose: () => void;
}

export function PowerBIEmbed({ report, onClose }: PowerBIEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`fixed inset-0 z-50 bg-background flex flex-col animate-fade-in ${
      isFullscreen ? '' : 'p-4 md:p-8'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'p-4 bg-card border-b' : 'mb-4'}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{report.nome_relatorio}</h2>
            {report.descricao && (
              <p className="text-sm text-muted-foreground">{report.descricao}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Embed Container - Placeholder for Power BI */}
      <div className={`flex-1 rounded-xl bg-card border overflow-hidden ${isFullscreen ? '' : 'shadow-elevated'}`}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center p-8 max-w-md">
            <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-6 animate-float">
              <svg className="w-10 h-10 text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 7h2v10H9V7zm4 4h2v6h-2v-6zm-8 2h2v4H5v-4z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Power BI Embed</h3>
            <p className="text-muted-foreground mb-4">
              O relatório <strong>{report.nome_relatorio}</strong> seria carregado aqui via Power BI Embedded API.
            </p>
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 text-left font-mono">
              <p>Report ID: {report.report_id}</p>
              <p>Workspace ID: {report.workspace_id}</p>
              <p>Dataset ID: {report.dataset_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
