import "dotenv/config";
import express from "express";
import cors from "cors";
import powerbiRoutes from "./routes/powerbiRoutes";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
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
