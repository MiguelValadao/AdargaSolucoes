import { Router } from "express";
import { pool } from "../config";
import { requireAuth } from "../middleware/auth";

const router = Router();

export interface CarBody {
  marca?: string;
  modelo?: string;
  ano?: number;
  quilometragem?: number | null;
  combustivel?: string;
  cambio?: string;
  cor?: string;
  preco?: number;
  imagem_url?: string;
  descricao?: string;
  destaque?: boolean;
  status?: string;
}

function validateCar(body: CarBody): string | null {
  if (!body.marca?.trim()) return "Marca é obrigatória.";
  if (!body.modelo?.trim()) return "Modelo é obrigatório.";
  if (!body.ano || body.ano < 1900 || body.ano > 2100) return "Ano inválido.";
  if (body.preco === undefined || body.preco === null || body.preco < 0) return "Preço inválido.";
  return null;
}

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, marca, modelo, ano, quilometragem, combustivel, cambio, cor,
              preco, imagem_url, descricao, destaque, status, created_at
       FROM cars ORDER BY destaque DESC, created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar carros:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, marca, modelo, ano, quilometragem, combustivel, cambio, cor,
              preco, imagem_url, descricao, destaque, status, created_at
       FROM cars WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Carro não encontrado." });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar carro:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const body = req.body as CarBody;
  const invalid = validateCar(body);
  if (invalid) return res.status(400).json({ error: invalid });

  const allowedStatus = ["disponivel", "reservado", "vendido"];
  const status = allowedStatus.includes(body.status || "") ? body.status : "disponivel";

  try {
    const { rows } = await pool.query(
      `INSERT INTO cars (marca, modelo, ano, quilometragem, combustivel, cambio, cor,
                         preco, imagem_url, descricao, destaque, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        body.marca!.trim(),
        body.modelo!.trim(),
        body.ano,
        body.quilometragem ?? null,
        body.combustivel || null,
        body.cambio || null,
        body.cor || null,
        body.preco,
        body.imagem_url || null,
        body.descricao || null,
        body.destaque === true,
        status,
      ]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Erro ao criar carro:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const body = req.body as CarBody;
  const invalid = validateCar(body);
  if (invalid) return res.status(400).json({ error: invalid });

  const allowedStatus = ["disponivel", "reservado", "vendido"];
  const status = allowedStatus.includes(body.status || "") ? body.status : "disponivel";

  try {
    const { rows } = await pool.query(
      `UPDATE cars SET marca=$1, modelo=$2, ano=$3, quilometragem=$4, combustivel=$5,
                       cambio=$6, cor=$7, preco=$8, imagem_url=$9, descricao=$10,
                       destaque=$11, status=$12
       WHERE id=$13 RETURNING *`,
      [
        body.marca!.trim(),
        body.modelo!.trim(),
        body.ano,
        body.quilometragem ?? null,
        body.combustivel || null,
        body.cambio || null,
        body.cor || null,
        body.preco,
        body.imagem_url || null,
        body.descricao || null,
        body.destaque === true,
        status,
        req.params.id,
      ]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Carro não encontrado." });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar carro:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING id", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Carro não encontrado." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao excluir carro:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;