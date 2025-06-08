const Fornecedor = require("../models/fornecedor.model.js");
const Vendedor   = require("../models/vendedor.model.js");

function getFornecedorDetails(req, res) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  Fornecedor.getById(Number(id), (err, fornecedor) => {
    if (err) {
      console.error(`Erro ao buscar fornecedor com id ${id}:`, err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (!fornecedor) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    return res.status(200).json(fornecedor);
  });
}
 
//2) Atualiza perfil do fornecedor logado

async function updateFornecedorProfile(req, res) {
  const body  = req.body  || {};
  const files = req.files || {};

  // campos da tabela `fornecedor`
  const campos = {
    razaoSocial:        body.razaoSocial,
    nomeFantasia:       body.nomeFantasia,
    inscricaoEstadual:  body.inscricaoEstadual,
    inscricaoMunicipal: body.inscricaoMunicipal,
    logradouro:         body.logradouro,
    numero:             body.numero,
    complemento:        body.complemento,
    repNome:            body.repNome,
    repCpf:             body.repCpf,
    repTelefone:        body.repTelefone
  };

  // campos da tabela `usuario` (via Vendedor.updateProfile)
  const userDados = {
    email:    body.email,
    telefone: body.telefone,
    senha:    body.senha
  };

  if (files.imagemPerfil && files.imagemPerfil[0]) {
    const img = files.imagemPerfil[0];
    userDados.imagemBase64 = img.buffer.toString("base64");
    userDados.imagemTipo   = img.mimetype;
  }

  if (files.documentoPerfil && files.documentoPerfil[0]) {
    const doc = files.documentoPerfil[0];
    userDados.documentoBase64 = doc.buffer.toString("base64");
    userDados.documentoTipo   = doc.mimetype;
  }

  try {
    // 1) atualiza e-mail / telefone / senha / arquivos em `usuario`
    await Vendedor.updateProfile(req.user.id_usuario, userDados);
    // 2) atualiza dados específicos na tabela `fornecedor`
    await Fornecedor.updateProfile(req.user.id_usuario, campos);
    return res.status(200).json({ mensagem: "Perfil de fornecedor atualizado" });
  } catch (e) {
    console.error("Falha ao atualizar perfil de fornecedor:", e);
    if (e.message === "Email já utilizado") {
      return res.status(400).json({ erro: e.message });
    }
    return res.status(500).json({ erro: "Falha ao atualizar perfil" });
  }
}

module.exports = {getFornecedorDetails,updateFornecedorProfile};
