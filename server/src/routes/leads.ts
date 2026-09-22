import { Router } from "express";
import { pool, WHATSAPP_NUMBER } from "../config";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", async (req, res) => {
  const { nome, email, telefone, mensagem, carro_id } = req.body as {
    nome?: string;
    email?: string;
    telefone?: string;
    mensagem?: string;
    carro_id?: number | null;
  };

  if (!nome?.trim()) return res.status(400).json({ error: "Informe seu nome." });
  if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Informe um e-mail válido." });
  }
  if (!telefone?.trim()) return res.status(400).json({ error: "Informe seu telefone." });

  try {
    if (carro_id) {
      const carro = await pool.query("SELECT id FROM cars WHERE id = $1", [carro_id]);
      if (carro.rowCount === 0) {
        return res.status(400).json({ error: "Carro não encontrado." });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO leads (nome, email, telefone, mensagem, carro_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, nome, created_at`,
      [nome.trim(), email.trim(), telefone.trim(), mensagem?.trim() || null, carro_id || null]
    );

    return res.status(201).json({ lead: rows[0], whatsapp: WHATSAPP_NUMBER });
  } catch (err) {
    console.error("Erro ao criar lead:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.get("/", requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.nome, l.email, l.telefone, l.mensagem, l.status, l.created_at,
              c.marca, c.modelo, c.ano
       FROM leads l
       LEFT JOIN cars c ON c.id = l.carro_id
       ORDER BY l.created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar leads:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body as { status?: string };
  const allowed = ["novo", "contato", "negociando", "fechado", "arquivado"];
  if (!status || !allowed.includes(status)) {
    return res.status(400).json({ error: "Status inválido." });
  }
  try {
    const { rows } = await pool.query(
      "UPDATE leads SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Lead não encontrado." });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar lead:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("DELETE FROM leads WHERE id = $1 RETURNING id", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Lead não encontrado." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao excluir lead:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;