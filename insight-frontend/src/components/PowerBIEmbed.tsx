import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useEffect, useState } from "react";

type EmbedConfig = {
  accessToken: string;
  embedUrl: string;
  reportId: string;
};

type Props = {
  reportKey: string;
};

export default function PowerBIReport({ reportKey }: Props) {
  const [config, setConfig] = useState<EmbedConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmbedConfig() {
      try {
        setConfig(null);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error("VITE_API_URL não configurada");
        }

        const response = await fetch(
          `${apiUrl}/powerbi/embed-token?reportKey=${reportKey}`
        );

        if (!response.ok) {
          throw new Error("Erro ao obter embed token");
        }

        const data = await response.json();

        setConfig({
          accessToken: data.token,
          reportId: data.reportId,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${data.reportId}`,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro inesperado");
      }
    }

    loadEmbedConfig();
  }, [reportKey]);

  if (error) {
    return <p>Erro ao carregar relatório: {error}</p>;
  }

  if (!config) {
    return <p>Carregando relatório...</p>;
  }

  return (
    <PowerBIEmbed
      embedConfig={{
        type: "report",
        id: config.reportId,
        embedUrl: config.embedUrl,
        accessToken: config.accessToken,
        tokenType: models.TokenType.Embed,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: false },
          },
        },
      }}
      cssClassName="powerbi-report"
    />
  );
}
