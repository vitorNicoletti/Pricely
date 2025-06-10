const Produtos = require("../models/produtos.model.js");

exports.list = async (req, res) => {
  const lista = await Produtos.getAll();
  res.json(lista);
};

exports.listByFornecedor = async (req, res) => {
  const { id } = req.params;
  const lista = await Produtos.getByFornecedor(id);
  res.json(lista);
};

exports.create = async (req, res) => {
  try {
    const { nome, descricao, preco_unidade, estado } = req.body;
    const userId = req.user.id_usuario;
    const imagem = req.file; // multer
    const id = await Produtos.create({
      nome,
      descricao,
      preco_unidade,
      estado,
      id_fornecedor: userId,
      imagemBuffer: imagem?.buffer,
      imagemNome: imagem?.originalname,
      imagemTipo: imagem?.mimetype
    });
    res.status(201).json({ mensagem: "Produto criado", id_produto: id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
};

exports.update = async (req, res) => {
  try {
    const { nome, descricao, preco_unidade, estado } = req.body;
    const userId = req.user.id_usuario;
    const imagem = req.file;
    const affected = await Produtos.update({
      id_produto: req.params.id,
      nome,
      descricao,
      preco_unidade,
      estado,
      id_fornecedor: userId,
      newImagem: imagem
    });
    if (!affected) return res.status(404).json({ erro: "Produto não encontrado ou não é seu" });
    res.json({ mensagem: "Produto atualizado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const affected = await Produtos.remove(req.params.id, userId);
    if (!affected) return res.status(404).json({ erro: "Produto não encontrado ou não é seu" });
    res.json({ mensagem: "Produto excluído" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao excluir produto" });
  }
};