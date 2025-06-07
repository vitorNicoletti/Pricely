const Fornecedor = require("../models/fornecedor.model.js");

// 1) Busca detalhes do fornecedor por ID
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
  try {
    const campos = {
      razaoSocial:        req.body.razaoSocial,
      nomeFantasia:       req.body.nomeFantasia,
      inscricaoEstadual:  req.body.inscricaoEstadual,
      inscricaoMunicipal: req.body.inscricaoMunicipal,
      logradouro:         req.body.logradouro,
      numero:             req.body.numero,
      complemento:        req.body.complemento,
      repNome:            req.body.repNome,
      repCpf:             req.body.repCpf,
      repTelefone:        req.body.repTelefone
    };

    await Fornecedor.updateProfile(req.user.id, campos);
    return res.status(200).json({ mensagem: "Perfil de fornecedor atualizado" });
  } catch (e) {
    console.error("Falha ao atualizar perfil de fornecedor:", e);
    return res.status(500).json({ erro: "Falha ao atualizar perfil" });
  }
}

module.exports = {getFornecedorDetails,updateFornecedorProfile};
