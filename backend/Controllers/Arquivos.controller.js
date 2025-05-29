import { db } from "../db.js";

// POST /api/arquivos
export const createArquivo = (req, res) => {
  const { nome, tipo, base64 } = req.body;
  if (!nome || !tipo || !base64)
    return res.status(400).json({ error: "nome, tipo e base64 são obrigatórios" });

  const sql = `INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)`;
  db.query(sql, [nome, tipo, base64], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

// GET /api/arquivos/:id
export const getArquivoById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT nome, tipo, dados FROM arquivos WHERE id = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Arquivo não encontrado" });
    const { nome, tipo, dados } = rows[0];
    res.json({ nome, dataURL: `data:${tipo};base64,${dados}` });
  });
};
