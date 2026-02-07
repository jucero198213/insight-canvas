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

  useEffect(() => {
    async function loadEmbedConfig() {
      setConfig(null);

      const response = await fetch(
        `/powerbi/embed-token?reportKey=${reportKey}`
      );

      const data = await response.json();

      setConfig({
        accessToken: data.token,
        reportId: data.reportId,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${data.reportId}`,
      });
    }

    loadEmbedConfig();
  }, [reportKey]);

  if (!config) return <p>Carregando relatório...</p>;

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
