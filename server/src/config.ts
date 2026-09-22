import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5511999999999";

export const PORT = Number(process.env.PORT) || 3333;

export const JWT_SECRET = process.env.JWT_SECRET || "segredo-padrao";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";