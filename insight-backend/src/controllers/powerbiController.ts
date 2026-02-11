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

export async function getEmbedToken(req: Request, res: Response) {
  try {
    const origin = req.headers.origin;

    // 🔐 Validação apenas se houver origin (CORS real)
    if (origin && !allowedOrigins.includes(origin) && !origin.endsWith('.vercel.app') && !origin.endsWith('.lovable.app')) {
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
