import { Router } from "express";
import { getEmbedToken } from "../controllers/powerbiController";

const router = Router();

router.get("/embed-token", getEmbedToken);

export default router;
