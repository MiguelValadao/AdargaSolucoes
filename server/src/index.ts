import express from "express";
import cors from "cors";
import path from "path";
import { pool, PORT, WHATSAPP_NUMBER } from "./config";
import authRoutes from "./routes/auth";
import carRoutes from "./routes/cars";
import leadRoutes from "./routes/leads";
import uploadRoutes from "./routes/upload";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

app.get("/settings", (_req, res) => {
  return res.json({ whatsapp: WHATSAPP_NUMBER });
});

app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/leads", leadRoutes);
app.use("/upload", uploadRoutes);

app.use((_req, res) => {
  return res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`ADARGA API rodando em http://localhost:${PORT}`);
});