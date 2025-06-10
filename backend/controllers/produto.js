const db = require("../db.js");
const Arquivos = require("../models/arquivos.model.js");
const Produtos = require("../models/produtos.model.js");

// CADASTRAR
exports.create = async (req, res) => {
  try {
    const { nome, descricao, preco_unidade, estado } = req.body;
    const userId = req.user.id_usuario;

    if (!nome || !descricao || !preco_unidade || !estado) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    let imagemId = null;
    if (req.file) {
      // multer já processou em req.file
      imagemId = await Arquivos.salvarArquivo(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );
    }

    const sql = `
      INSERT INTO produto
        (nome, descricao, preco_unidade, estado, id_fornecedor, imagem_arquivo_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [nome, descricao, preco_unidade, estado, userId, imagemId];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao cadastrar produto" });
      }
      res.status(201).json({
        mensagem: "Produto cadastrado com sucesso",
        id_produto: result.insertId
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro interno" });
  }
};

// ATUALIZAR
exports.update = async (req, res) => {
  try {
    const { nome, descricao, preco_unidade, estado } = req.body;
    const id = req.params.id;
    const userId = req.user.id_usuario;

    // 1) Busca o produto atual para obter o arquivo antigo
    const [current] = await db.promise().query(
      'SELECT imagem_arquivo_id FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id, userId]
    );
    const oldImgId = current[0]?.imagem_arquivo_id || null;

    // 2) Se veio novo arquivo, salva e guarda novo ID
    let newImgId = null;
    if (req.file) {
      newImgId = await Arquivos.salvarArquivo(
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );
    }

    // 3) Prepara SET e parâmetros
    const setClause = newImgId
      ? "nome=?, descricao=?, preco_unidade=?, estado=?, imagem_arquivo_id=?"
      : "nome=?, descricao=?, preco_unidade=?, estado=?";
    const params = newImgId
      ? [nome, descricao, preco_unidade, estado, newImgId, id, userId]
      : [nome, descricao, preco_unidade, estado, id, userId];

    // 4) Executa o UPDATE
    const [result] = await db.promise().query(
      `UPDATE produto SET ${setClause} WHERE id_produto = ? AND id_fornecedor = ?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado ou não é seu" });
    }

    // 5) Deleta o arquivo antigo, se havia e veio um novo
    if (oldImgId && newImgId) {
      await Arquivos.deleteArquivo(oldImgId);
    }

    return res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno" });
  }
};

// EXCLUIR
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id_usuario;

    // 1) Busca o produto para pegar o arquivo
    const [rows] = await db.promise().query(
      'SELECT imagem_arquivo_id FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id, userId]
    );
    const imgId = rows[0]?.imagem_arquivo_id || null;

    // 2) Deleta o produto
    const [result] = await db.promise().query(
      'DELETE FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Produto não encontrado ou não é seu" });
    }

    // 3) Deleta o arquivo associado, se existir
    if (imgId) {
      await Arquivos.deleteArquivo(imgId);
    }

    return res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao excluir produto" });
  }
};

// LISTAR (público)
exports.list = (req, res) => {
  Produtos.getAll((err, produtos) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar produtos" });
    }
    res.json(produtos);
  });
};