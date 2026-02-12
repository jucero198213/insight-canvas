import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Relatorio {
  id: string;
  nome: string;
  descricao: string | null;
  report_id: string;
}

interface PowerBIEmbedProps {
  report: Relatorio;
  onClose: () => void;
}

interface EmbedData {
  token: string;
  embedUrl: string;
  expiration: string;
  reportId: string;
}

export function PowerBIEmbed({ report, onClose }: PowerBIEmbedProps) {
  const [embedData, setEmbedData] = useState<EmbedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbedToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Busca a URL da API da Render das variáveis de ambiente
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error('A variável VITE_API_URL não está configurada no ambiente da Vercel.');
        }

        // Mapeamento do reportId para a key esperada pelo seu backend (financeiro, dre, compras)
        // Se o nome do relatório contiver a palavra, usamos a chave correspondente
        const nomeLower = report.nome.toLowerCase();
        
        // Mapeamento inteligente baseado no nome do relatório
        let reportKey = 'financeiro';
        if (nomeLower.includes('dre')) {
          reportKey = 'dre';
        } else if (nomeLower.includes('compra')) {
          reportKey = 'compras';
        } else if (nomeLower.includes('faturamento') || nomeLower.includes('financeiro') || nomeLower.includes('relatório financeiro') || nomeLower.includes('relatorio financeiro')) {
          reportKey = 'financeiro';
        }

        const response = await fetch(`${apiUrl}/powerbi/embed-token?reportKey=${reportKey}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao obter token do backend na Render');
        }

        const data = await response.json();
        setEmbedData(data);
      } catch (err: any) {
        console.error('[PowerBIEmbed] Error fetching token from Render:', err);
        setError(err.message || 'Erro de conexão com o servidor de relatórios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmbedToken();
  }, [report.id, report.nome]);

  useEffect(() => {
    if (embedData && !isLoading) {
      const iframe = document.getElementById('powerbi-iframe') as HTMLIFrameElement;
      if (iframe) {
        const message = {
          action: "loadReport",
          accessToken: embedData.token,
        };
        // O Power BI Embedded requer um tempo pequeno para o iframe estar pronto para receber mensagens
        const timeout = setTimeout(() => {
          iframe.contentWindow?.postMessage(JSON.stringify(message), "*");
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [embedData, isLoading]);

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

      {/* Content */}
      <div className="flex-1 relative bg-muted/20">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Conectando ao servidor Power BI...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de Conexão</AlertTitle>
              <AlertDescription className="mt-2">
                {error}
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : embedData ? (
          <iframe
            id="powerbi-iframe"
            title={report.nome}
            src={`${embedData.embedUrl}&filterPaneEnabled=false&navContentPaneEnabled=false`}
            className="w-full h-full border-0"
            allowFullScreen
          />
        ) : null}
      </div>
    </div>
  );
}
