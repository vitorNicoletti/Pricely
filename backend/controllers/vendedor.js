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

  // 3) Busca detalhes do vendedor por ID
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

// 2) Atualiza perfil logado (email, telefone, senha, imagem, documento)
async function updateVendedorProfile(req, res) {
  const body  = req.body  || {};
  const files = req.files || {};

  const dados = {
    email:    body.email,
    telefone: body.telefone,
    senha:    body.senha
  };

  if (files.imagemPerfil && files.imagemPerfil[0]) {
    const img = files.imagemPerfil[0];
    dados.imagemBase64 = img.buffer.toString("base64");
    dados.imagemTipo   = img.mimetype;
  }

  if (files.documentoPerfil && files.documentoPerfil[0]) {
    const doc = files.documentoPerfil[0];
    dados.documentoBase64 = doc.buffer.toString("base64");
    dados.documentoTipo   = doc.mimetype;
  }

  try {
    await Vendedor.updateProfile(req.user.id_usuario, dados);
    return res.status(200).json({ mensagem: "Perfil de vendedor atualizado" });
  } catch (e) {
    console.error("Falha ao atualizar perfil:", e);
    if (e.message === "Email já utilizado") {
      return res.status(400).json({ erro: e.message });
    }
    return res.status(500).json({ erro: "Falha ao atualizar perfil" });
  }
}

module.exports = {getVendedorDetails,updateVendedorProfile};
