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
    console.log("[ctrl.seguir] seguidor=", seguidorId, "seguido=", seguidoId);

    if (!(await isVendedor(seguidorId))) {
      return res.status(403).json({ erro: "Somente vendedores podem seguir." });
    }
    console.log("[ctrl.seguir] é vendedor OK");

    if (!(await isFornecedor(seguidoId))) {
      return res.status(404).json({ erro: "Fornecedor não encontrado." });
    }
    console.log("[ctrl.seguir] fornecedor existe OK");

    // Use a versão callback do model (ela já existe),
    // mas você poderia também promisificar esse método.
    Seguindo.seguir(seguidorId, seguidoId, (err, result) => {
      if (err) {
        console.error("[ctrl.seguir] erro ao inserir:", err);
        return res.status(500).json({ erro: "Erro ao seguir." });
      }
      console.log("[ctrl.seguir] inserido com sucesso:", result);
      res.json({ followed: true });
    });
  } catch (e) {
    console.error("[ctrl.seguir] erro interno:", e);
    res.status(500).json({ erro: "Erro interno." });
  }
};

// DELETE /seguindo/:id_fornecedor
exports.unfollow = async (req, res) => {
  const seguidorId = req.user.id_usuario;
  const seguidoId  = Number(req.params.id);

  try {
    console.log("[ctrl.unfollow] seguidor=", seguidorId, "seguido=", seguidoId);
    Seguindo.deixarDeSeguir(seguidorId, seguidoId, (err, result) => {
      if (err) {
        console.error("[ctrl.unfollow] erro ao deletar:", err);
        return res.status(500).json({ erro: "Erro ao deixar de seguir." });
      }
      console.log("[ctrl.unfollow] deletado com sucesso:", result);
      res.json({ followed: false });
    });
  } catch (e) {
    console.error("[ctrl.unfollow] erro interno:", e);
    res.status(500).json({ erro: "Erro interno." });
  }
};

// GET /seguindo/:id_fornecedor  → devolve {followed, total}
exports.status = async (req, res) => {
  const seguidorId = req.user.id_usuario;
  const seguidoId  = Number(req.params.id);

  try {
    console.log("[ctrl.status] seguidor=", seguidorId, "seguido=", seguidoId);
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
    console.log("[ctrl.status] followed=", followed, "total=", total);
    res.json({ followed, total });
  } catch (e) {
    console.error("[ctrl.status] erro interno:", e);
    res.status(500).json({ erro: "Erro ao consultar." });
  }
};