const db = require('../db.js');
const Arquivos = require('./arquivos.model.js');
const Promocao = require('./promocao.model.js');
const Oferta = require('./oferta.model.js');
const Fornecedor = require('./fornecedor.model.js');
const AvaliacaoProduto = require('./avaliacao_produto.model.js');


/**
 * Enriquecer um produto com:
 *  1) imagem (arquivo)
 *  2) lista de promoções (com id_fornecedor + nome_fornecedor)
 *  3) avaliação média
 *
 * @param {object} produto - objeto do produto cru
 * @returns {Promise<object>} - produto enriquecido
 */

async function enrichProduto(produto) {
  // imagem
  produto.imagem = null;
  if (produto.imagem_arquivo_id) {
    produto.imagem = await Arquivos.getArqPorId(produto.imagem_arquivo_id).catch(() => null);
  }
  // promoções
  produto.promocoes = [];
  try {
    const promocoes = await Promocao.getPromocoesByProduct(produto.id_produto);
    for (const promo of promocoes) {
      const idFornecedor = await Oferta.getIdFornecedorByOferta(promo.id_oferta).catch(() => null);
      let nomeFornecedor = null;

      if (idFornecedor) {
        nomeFornecedor = await new Promise(res => {
          Fornecedor.getNome(idFornecedor, (err, nome) => res(err ? null : nome));
        });
      }
      produto.promocoes.push({ ...promo, id_fornecedor: idFornecedor, nome_fornecedor: nomeFornecedor });
    }
  } catch {
    produto.promocoes = [];
  }

  // avaliação media
  produto.avaliacao_media = await new Promise(res => {
    AvaliacaoProduto.getAvaliacaoPorProduto(produto.id_produto, (err, media) => res(err ? null : media));
  }).catch(() => null);
  return produto;
}

const Produtos = {

  /**
   * Retorna todos os produtos, enriquecendo cada um (imagem, promoções, avaliação).
   * @returns {Promise<Array<object>>}
   */
  getAll: async () => {
    const [rows] = await db.promise().query('SELECT * FROM produto');
    if (!rows.length) return [];
    return Promise.all(rows.map(enrichProduto));
  },
    /**
   * Retorna um produto pelo ID, enriquecido (imagem, promoções, avaliação).
   * @param {number} id - ID do produto
   * @returns {Promise<object|null>} - produto ou null se não encontrado
   */
  getById: async id => {
    const [rows] = await db.promise().query('SELECT * FROM produto WHERE id_produto = ?', [id]);
    if (!rows.length) return null;
    return enrichProduto(rows[0]);
  },
  // nova função: lista por fornecedor
  getByFornecedor: async id_fornecedor => {
    const [rows] = await db.promise().query(
      'SELECT * FROM produto WHERE id_fornecedor = ?',
      [id_fornecedor]
    );
    if (!rows.length) return [];
    return Promise.all(rows.map(enrichProduto));
  },
  create: async ({ nome, descricao, preco_unidade, estado, id_fornecedor, imagemBuffer, imagemNome, imagemTipo }) => {
    let imagem_arquivo_id = null;
    if (imagemBuffer) {
      imagem_arquivo_id = await Arquivos.salvarArquivo(imagemNome, imagemTipo, imagemBuffer);
    }
    const [result] = await db.promise().query(
      `INSERT INTO produto (nome, descricao, preco_unidade, estado, id_fornecedor, imagem_arquivo_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, descricao, preco_unidade, estado, id_fornecedor, imagem_arquivo_id]
    );
    return result.insertId;
  },
  update: async ({ id_produto, nome, descricao, preco_unidade, estado, id_fornecedor, newImagem }) => {
    const [rows] = await db.promise().query(
      'SELECT imagem_arquivo_id FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id_produto, id_fornecedor]
    );
    const oldImgId = rows[0]?.imagem_arquivo_id;
    let imagem_arquivo_id;
    if (newImagem) {
      imagem_arquivo_id = await Arquivos.salvarArquivo(newImagem.originalname, newImagem.mimetype, newImagem.buffer);
    }
    const setC = newImagem
      ? 'nome=?, descricao=?, preco_unidade=?, estado=?, imagem_arquivo_id=?'
      : 'nome=?, descricao=?, preco_unidade=?, estado=?';
    const params = newImagem
      ? [nome, descricao, preco_unidade, estado, imagem_arquivo_id, id_produto, id_fornecedor]
      : [nome, descricao, preco_unidade, estado, id_produto, id_fornecedor];
    const [resUpdate] = await db.promise().query(
      `UPDATE produto SET ${setC} WHERE id_produto = ? AND id_fornecedor = ?`,
      params
    );
    if (newImagem && oldImgId) await Arquivos.deleteArquivo(oldImgId);
    return resUpdate.affectedRows;
  },
  remove: async (id_produto, id_fornecedor) => {
    const [rows] = await db.promise().query(
      'SELECT imagem_arquivo_id FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id_produto, id_fornecedor]
    );
    const imgId = rows[0]?.imagem_arquivo_id;
    const [resDel] = await db.promise().query(
      'DELETE FROM produto WHERE id_produto = ? AND id_fornecedor = ?',
      [id_produto, id_fornecedor]
    );
    if (resDel.affectedRows && imgId) await Arquivos.deleteArquivo(imgId);
    return resDel.affectedRows;
  }
};

module.exports = Produtos;