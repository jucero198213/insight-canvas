import { X, Maximize2, Minimize2, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Relatorio {
  id: string;
  nome: string;
  descricao: string | null;
  report_id: string;
  dataset_id: string | null;
  cliente_id: string;
  status: string;
}

interface PowerBIEmbedProps {
  report: Relatorio;
  onClose: () => void;
}

interface EmbedToken {
  token: string;
  embedUrl: string;
  expiration: string;
}

export function PowerBIEmbed({ report, onClose }: PowerBIEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embedData, setEmbedData] = useState<EmbedToken | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchEmbedToken = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      const response = await supabase.functions.invoke('powerbi-embed-token', {
        body: { reportId: report.id },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao obter token de embed');
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Falha ao gerar token');
      }

      setEmbedData({
        token: response.data.token,
        embedUrl: response.data.embedUrl,
        expiration: response.data.expiration,
      });
    } catch (err: any) {
      console.error('[PowerBI] Embed error:', err);
      setError(err.message || 'Erro ao carregar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbedToken();
  }, [report.id]);

  // Build the embedded URL with token
  const getEmbedUrl = () => {
    if (!embedData) return '';
    const url = new URL(embedData.embedUrl);
    url.searchParams.set('filterPaneEnabled', 'true');
    url.searchParams.set('navContentPaneEnabled', 'true');
    return url.toString();
  };

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
            <h2 className="text-xl font-semibold text-foreground">{report.nome}</h2>
            {report.descricao && (
              <p className="text-sm text-muted-foreground">{report.descricao}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchEmbedToken}
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Embed Container */}
      <div className={`flex-1 rounded-xl bg-card border overflow-hidden ${isFullscreen ? '' : 'shadow-elevated'}`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando relatório...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="text-center max-w-md p-8">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar relatório</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchEmbedToken}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : embedData ? (
          <iframe
            ref={iframeRef}
            title={report.nome}
            src={getEmbedUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : null}
      </div>
    </div>
  );
}
