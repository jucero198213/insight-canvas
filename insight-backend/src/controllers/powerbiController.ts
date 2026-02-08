import { Request, Response } from "express";
import { generateEmbedToken } from "../services/powerbiEmbed";

/**
 * Origens autorizadas a solicitar embed token
 */
const allowedOrigins = [
  "https://analyticspro.com.br",
  "https://www.analyticspro.com.br",
  "https://insight-canvas-one.vercel.app",
  "http://localhost:5173",
  // futuramente:
  // "https://lovable.app"
];

export async function getEmbedToken(req: Request, res: Response) {
  try {
    const origin = req.headers.origin;

    // 🔐 Validação explícita de origem (defesa em profundidade)
    if (origin && !allowedOrigins.includes(origin)) {
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
