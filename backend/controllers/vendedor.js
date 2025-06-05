const Vendedor = require("../models/vendedor.model.js");

function getVendedorProfile(req, res) {
  // 1) Verificar se o middleware autenticarToken populou req.user.id
  const idUsuario = req.user && req.user.id;
  if (!idUsuario) {
    // Se não houver token ou middleware não populou, retorna 401
    return res.status(401).json({ message: "Não autorizado." });
  }

  // 2) busca TODO o perfil do vendedor
  Vendedor.getProfileByUserId(idUsuario, (err, perfil) => {
    if (err) {
      console.error("Erro ao obter perfil de vendedor:", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
    if (!perfil) {
      // Significa que não há registro em vendedor para esse usuário
      return res.status(404).json({ message: "Usuário não é vendedor." });
    }
    // 3) Retorna o perfil completo
    return res.status(200).json(perfil);
  });
}

module.exports = {
  getVendedorProfile
};