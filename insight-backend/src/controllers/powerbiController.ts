import { Request, Response } from "express";
import { generateEmbedToken } from "../services/powerbiEmbed";

/**
 * Origens autorizadas a solicitar embed token
 */
const allowedOrigins = [
  "https://analyticspro.com.br",
  "https://www.analyticspro.com.br",
  "https://insight-canvas-one.vercel.app",
  "https://insight-portal-connect.lovable.app",
  "http://localhost:5173",
];

function isAllowedRequest(req: Request): boolean {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  return allowedOrigins.some((allowed) => {
    return (
      (origin && origin.startsWith(allowed)) ||
      (referer && referer.startsWith(allowed))
    );
  });
}

export async function getEmbedToken(req: Request, res: Response) {
  try {
    // 🔐 Validação explícita de origem / referer
    if (!isAllowedRequest(req)) {
      return res.status(403).json({
        error: "Origin not allowed",
      });
    }

    const reportKey =
      typeof req.query.reportKey === "string"
        ? req.query.reportKey
        : "financeiro";

    const embedData = await generateEmbedToken(reportKey);

    return res.json(embedData);
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }
}
