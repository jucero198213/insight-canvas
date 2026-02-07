import { Request, Response } from "express";
import { generateEmbedToken } from "../services/powerbiEmbed";

export async function getEmbedToken(req: Request, res: Response) {
  try {
    const reportKey = String(req.query.reportKey || "financeiro");

    const embedData = await generateEmbedToken(reportKey);

    return res.json(embedData);
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      error: error.message,
    });
  }
}
