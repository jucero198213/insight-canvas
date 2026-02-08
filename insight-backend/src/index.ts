import "dotenv/config";
import express from "express";
import cors from "cors";
import powerbiRoutes from "./routes/powerbiRoutes";

const app = express();

/**
 * Origens permitidas para consumir o backend
 * (frontend + Lovable no futuro)
 */
const allowedOrigins = [
  "https://analyticspro.com.br",
  "https://www.analyticspro.com.br",
  "https://insight-canvas-one.vercel.app",
  "http://localhost:5173", // dev local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite chamadas sem origin (healthcheck, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.use("/powerbi", powerbiRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
