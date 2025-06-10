const Fornecedor = require("../models/fornecedor.model.js");

/**
 * GET /api/fornecedor/:id   — perfil público de qualquer fornecedor
 * GET /api/fornecedor/me    — perfil do próprio (usando token)
 */
async function getFornecedorDetails(req, res) {
  try {
    let id = req.params.id || req.query.id || "me"; // pega o id do parâmetro ou da query, ou usa "me"

    // se veio “me”, troca pelo id do token
    if (id === "me") {
      if (!req.user || !req.user.id_usuario) {
        return res.status(401).json({ message: "Não autenticado." });
      }
      id = req.user.id_usuario;
    }

    // valida id numérico
    if (!/^\d+$/.test(String(id))) {
      return res.status(400).json({ message: "ID inválido." });
    }

    // chama o model (que agora retorna Promise)
    const fornecedor = await Fornecedor.getById(Number(id));
    if (!fornecedor) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    // devolve exatamente o objeto do model (já enriquecido)
    return res.status(200).json(fornecedor);

  } catch (err) {
    console.error("Erro ao buscar fornecedor:", err);
    return res.status(500).json({ message: "Erro no servidor." });
  }
}

/**
 * PUT /api/fornecedor/me  — atualiza perfil completo do fornecedor
 */
async function updateFornecedorProfile(req, res) {
  try {
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

    // 1) atualiza dados em `usuario` via Vendedor.updateProfile
    await require("./vendedor.js").updateProfile(req.user.id_usuario, userDados);
    // 2) atualiza dados em `fornecedor`
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

module.exports = {
  getFornecedorDetails,
  updateFornecedorProfile
};