import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        email VARCHAR(160) UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        marca VARCHAR(80) NOT NULL,
        modelo VARCHAR(120) NOT NULL,
        ano INTEGER NOT NULL,
        quilometragem INTEGER,
        combustivel VARCHAR(40),
        cambio VARCHAR(40),
        cor VARCHAR(40),
        preco NUMERIC(12,2) NOT NULL,
        imagem_url TEXT,
        descricao TEXT,
        destaque BOOLEAN NOT NULL DEFAULT FALSE,
        status VARCHAR(20) NOT NULL DEFAULT 'disponivel',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(160) NOT NULL,
        email VARCHAR(160) NOT NULL,
        telefone VARCHAR(30) NOT NULL,
        mensagem TEXT,
        carro_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'novo',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_leads_carro ON leads(carro_id);
    `);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@adarga.com.br";
    const existing = await client.query("SELECT id FROM admins WHERE email = $1", [adminEmail]);
    if (existing.rowCount === 0) {
      const senha = process.env.ADMIN_PASSWORD || "Adarga@2024";
      const hash = await bcrypt.hash(senha, 10);
      await client.query(
        `INSERT INTO admins (nome, email, senha_hash) VALUES ($1, $2, $3)`,
        [process.env.ADMIN_NAME || "Administrador", adminEmail, hash]
      );
      console.log(`Admin padrão criado: ${adminEmail}`);
    } else {
      console.log("Admin padrão já existe.");
    }

    await client.query("COMMIT");
    console.log("Schema aplicado com sucesso.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Falha ao aplicar schema:", err);
  process.exit(1);
});