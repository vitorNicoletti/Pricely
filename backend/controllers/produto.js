const Produtos = require("../models/produtos.model.js");

/**
 * GET /api/produtos
 * Lista todos os produtos
 * @returns {Array<object>} lista de produtos enriquecidos
 */
exports.list = async (req, res) => {
  try {
    const lista = await Produtos.getAll();
    return res.json(lista);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    return res.status(500).json({ erro: "Erro interno ao buscar produtos" });
  }
};

/**
 * GET /api/produtos/fornecedor/:id
 * Lista produtos de um fornecedor específico
 * @param {string} req.params.id - ID do fornecedor
 * @returns {Array<object>} lista de produtos
 */
exports.listByFornecedor = async (req, res) => {
  const { id } = req.params;
  // valida ID numérico positivo
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ erro: "ID de fornecedor inválido." });
  }
  try {
    const lista = await Produtos.getByFornecedor(Number(id));
    return res.json(lista);
  } catch (err) {
    console.error("Erro ao listar produtos por fornecedor:", err);
    return res.status(500).json({ erro: "Erro interno ao buscar produtos do fornecedor" });
  }
};

/**
 * POST /api/produtos
 * Cria um novo produto associado ao fornecedor autenticado
 * @body {string} nome          - nome do produto (obrigatório)
 * @body {string} descricao     - descrição (obrigatório)
 * @body {number} preco_unidade - preço unitário (obrigatório > 0)
 * @file {file}   imagem        - arquivo de imagem (opcional)
 * @returns {object} mensagem e id do produto criado
 */
exports.create = async (req, res) => {
  try {
    const { nome, descricao, preco_unidade } = req.body;
    const userId = req.user.id_usuario;

    // validações de entrada
    if (!nome || !descricao) {
      return res.status(400).json({ erro: "Nome e descrição são obrigatórios." });
    }
    const preco = Number(preco_unidade);
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ erro: "Preço unitário inválido." });
    }

    const imagem = req.file;
    const id = await Produtos.create({
      nome,
      descricao,
      preco_unidade: preco,
      estado: "ATIVO",
      id_fornecedor: userId,
      imagemBuffer: imagem?.buffer,
      imagemNome: imagem?.originalname,
      imagemTipo: imagem?.mimetype
    });

    return res.status(201).json({ mensagem: "Produto criado", id_produto: id });
  } catch (e) {
    console.error("Erro ao criar produto:", e);
    return res.status(500).json({ erro: "Erro interno ao cadastrar produto" });
  }
};

/**
 * PUT /api/produtos/:id
 * Atualiza um produto existente do fornecedor autenticado
 * @param {string} req.params.id - ID do produto
 * @body {string} nome
 * @body {string} descricao
 * @body {number} preco_unidade
 * @body {string} estado
 * @file {file}   newImagem
 * @returns {object} mensagem de sucesso
 */
exports.update = async (req, res) => {
  const { id } = req.params;
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ erro: "ID de produto inválido." });
  }
  try {
    const { nome, descricao, preco_unidade, estado } = req.body;
    const userId = req.user.id_usuario;
    const imagem = req.file;

    // validações
    if (!nome || !descricao) {
      return res.status(400).json({ erro: "Nome e descrição são obrigatórios." });
    }
    const preco = Number(preco_unidade);
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ erro: "Preço unitário inválido." });
    }
    if (!["ATIVO","INATIVO"].includes(estado)) {
      return res.status(400).json({ erro: "Estado deve ser 'ATIVO' ou 'INATIVO'." });
    }

    const affected = await Produtos.update({
      id_produto: Number(id),
      nome,
      descricao,
      preco_unidade: preco,
      estado,
      id_fornecedor: userId,
      newImagem: imagem
    });
    if (!affected) {
      return res.status(404).json({ erro: "Produto não encontrado ou não é seu." });
    }
    return res.json({ mensagem: "Produto atualizado" });
  } catch (e) {
    console.error("Erro ao atualizar produto:", e);
    return res.status(500).json({ erro: "Erro interno ao atualizar produto" });
  }
};

/**
 * DELETE /api/produtos/:id
 * Remove um produto do fornecedor autenticado
 * @param {string} req.params.id - ID do produto
 * @returns {object} mensagem de sucesso
 */
exports.remove = async (req, res) => {
  const { id } = req.params;
  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ erro: "ID de produto inválido." });
  }
  try {
    const userId = req.user.id_usuario;
    const affected = await Produtos.remove(Number(id), userId);
    if (!affected) {
      return res.status(404).json({ erro: "Produto não encontrado ou não é seu." });
    }
    return res.json({ mensagem: "Produto excluído" });
  } catch (e) {
    console.error("Erro ao excluir produto:", e);
    return res.status(500).json({ erro: "Erro interno ao excluir produto" });
  }
};
