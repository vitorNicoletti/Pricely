const Vendedor = require("../models/vendedor.model.js");

function getVendedorDetails(req, res) {
  let idUsuario;
  // 1) Se houver parâmetro :id, usa-o
  if (req.params.id) {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(400).json({ message: "ID inválido." });
    }
    idUsuario = Number(req.params.id);
  } else {
    // 2) Senão, busca no token
    idUsuario = req.user && req.user.id_usuario;
    if (!idUsuario) {
      return res.status(401).json({ message: "Não autorizado." });
    }
  }
  // 3) Chama o modelo (getById agora retorna todo o perfil)
  Vendedor.getById(idUsuario, (err, perfil) => {
    if (err) {
      console.error("Erro ao obter perfil de vendedor:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
    if (!perfil) {
      return res.status(404).json({ message: "Usuário não é vendedor." });
    }
    return res.status(200).json(perfil);
  });
}

module.exports = {
  getVendedorDetails,
};
