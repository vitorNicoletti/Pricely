// controllers/seguindo.js
const Seguindo   = require("../models/seguindo.model");
const Vendedor   = require("../models/vendedor.model");
const Fornecedor = require("../models/fornecedor.model");

// Saber se usuário é vendedor (modelo promise-based)
async function isVendedor(id) {
  try {
    const row = await Vendedor.getById(id);
    return !!row;
  } catch (err) {
    throw err;
  }
}

// Saber se usuário é fornecedor (modelo promise-based)
async function isFornecedor(id) {
  try {
    const row = await Fornecedor.getById(id);
    return !!row;
  } catch (err) {
    throw err;
  }
}

// POST /seguindo/:id_fornecedor
exports.seguir = async (req, res) => {
  const seguidorId = req.user.id_usuario;
  const seguidoId  = Number(req.params.id);

  try {
    if (!(await isVendedor(seguidorId))) {
      return res.status(403).json({ erro: "Somente vendedores podem seguir." });
    }

    if (!(await isFornecedor(seguidoId))) {
      return res.status(404).json({ erro: "Fornecedor não encontrado." });
    }

    // Use a versão callback do model (ela já existe),
    // mas você poderia também promisificar esse método.
    Seguindo.seguir(seguidorId, seguidoId, (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao seguir." });
      }
      res.json({ followed: true });
    });
  } catch (e) {
    res.status(500).json({ erro: "Erro interno." });
  }
};

// DELETE /seguindo/:id_fornecedor
exports.unfollow = async (req, res) => {
  const seguidorId = req.user.id_usuario;
  const seguidoId  = Number(req.params.id);

  try {
    Seguindo.deixarDeSeguir(seguidorId, seguidoId, (err, result) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao deixar de seguir." });
      }
      res.json({ followed: false });
    });
  } catch (e) {
    res.status(500).json({ erro: "Erro interno." });
  }
};

// GET /seguindo/:id_fornecedor  → devolve {followed, total}
exports.status = async (req, res) => {
  const seguidorId = req.user.id_usuario;
  const seguidoId  = Number(req.params.id);

  try {
    const followed = await new Promise((resolve, reject) =>
      Seguindo.estaSeguindo(seguidorId, seguidoId, (err, isF) =>
        err ? reject(err) : resolve(isF)
      )
    );
    const total = await new Promise((resolve, reject) =>
      Seguindo.totalSeguidores(seguidoId, (err, t) =>
        err ? reject(err) : resolve(t)
      )
    );
    res.json({ followed, total });
  } catch (e) {
    res.status(500).json({ erro: "Erro ao consultar." });
  }
};