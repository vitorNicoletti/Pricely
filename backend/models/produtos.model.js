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

  // 1) imagem
  produto.imagem = null;
  if (produto.imagem_arquivo_id) {
    try {
      produto.imagem = await Arquivos.getArqPorId(produto.imagem_arquivo_id) || null;
    } catch {
      produto.imagem = null;
    }
  }
  
  // 2) promoções
  produto.promocoes = [];
  try {
    const promocoes = await Promocao.getPromocoesByProduct(produto.id_produto);
    for (const promo of promocoes) {
      let idFornecedor = null;
      let nomeFornecedor = null;

      // id_fornecedor via Oferta
      try {
        idFornecedor = await Oferta.getIdFornecedorByOferta(promo.id_oferta);
      } catch {
        idFornecedor = null;
      }

      // nome_fornecedor via callback, embrulhado em Promise
      if (idFornecedor) {
        nomeFornecedor = await new Promise((resolve) => {
          Fornecedor.getNome(idFornecedor, (err, nome) => {
            if (err || !nome) return resolve(null);
            resolve(nome);
          });
        });
      }
      produto.promocoes.push({
        ...promo,
        id_fornecedor: idFornecedor,
        nome_fornecedor: nomeFornecedor
      });
    }
  } catch {
    produto.promocoes = [];
  }

  // 3) avaliação média via callback
  produto.avaliacao_media = null;
  try {
    produto.avaliacao_media = await new Promise((resolve) => {
      AvaliacaoProduto.getAvaliacaoPorProduto(produto.id_produto, (err, media) => {
        if (err || media == null) return resolve(null);
        resolve(media);
      });
    });
  } catch {
    produto.avaliacao_media = null;
  }

  return produto;
}

const Produtos = {
  /**
   * Retorna todos os produtos, enriquecendo cada um (imagem, promoções, avaliação).
   * @returns {Promise<Array<object>>}
   */
  getAll: async () => {
    const sql = 'SELECT * FROM produto';
    const results = await new Promise((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!results || results.length === 0) {
      return [];
    }
    
    return await Promise.all(results.map(enrichProduto));
  },

  /**
   * Retorna um produto pelo ID, enriquecido (imagem, promoções, avaliação).
   * @param {number} id - ID do produto
   * @returns {Promise<object|null>} - produto ou null se não encontrado
   */
  getById: async (id) => {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?';
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!results || results.length === 0) {
      return null;
    }

    return await enrichProduto(results[0]);
  }
};

module.exports = Produtos;
