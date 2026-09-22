import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body as { email?: string; senha?: string };
  if (!email || !senha) {
    return res.status(400).json({ error: "Informe e-mail e senha." });
  }
  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email.trim().toLowerCase()]);
    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(senha, admin.senha_hash))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    const token = jwt.sign(
      { id: admin.id, nome: admin.nome, email: admin.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
    return res.json({
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  return res.json({ admin: req.admin });
});

export default router;