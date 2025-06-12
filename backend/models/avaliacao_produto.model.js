const db = require('../db.js');

/**
 * Model para avaliações de produto
 */
const avaliacao_produto = {
  /**
   * Cria uma nova avaliação de produto.
   * Insere em `avaliacao`, `avaliacao_produto` e atualiza a compra.
   * @param {number} id_compra
   * @param {number} avaliacao - estrelas (1 a 5)
   * @param {string} texto_avaliacao
   * @param {number} id_produto
   * @returns {Promise<number|null>} id_avaliacao ou null em caso de erro
   */
  createAvaliacao: async (id_compra, avaliacao, texto_avaliacao, id_produto) => {
    const sqlAvaliacao = `
      INSERT INTO avaliacao (texto_avaliacao, avaliacao)
      VALUES (?, ?)
    `;
    const sqlAvaliacaoProduto = `
      INSERT INTO avaliacao_produto (id_avaliacao, id_produto)
      VALUES (?, ?)
    `;
    const sqlAtualizaCompra = `
      UPDATE compra
      SET id_avaliacao_produto = ?
      WHERE id_compra = ?
    `;

    try {
      // 1) Inserir na tabela `avaliacao`
      const resultA = await new Promise((resolve, reject) => {
        db.query(sqlAvaliacao, [texto_avaliacao, avaliacao], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const id_avaliacao = resultA.insertId;

      // 2) Inserir na tabela `avaliacao_produto`
      await new Promise((resolve, reject) => {
        db.query(sqlAvaliacaoProduto, [id_avaliacao, id_produto], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      // 3) Atualizar compra com o id de avaliação do produto
      await new Promise((resolve, reject) => {
        db.query(sqlAtualizaCompra, [id_avaliacao, id_compra], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      return id_avaliacao;
    } catch (error) {
      console.error('Erro ao criar avaliação de produto:', error);
      return null;
    }
  },

  /**
   * Busca todas as avaliações (estrelas) de um produto e retorna a média
   * @param {number} productId
   * @param {function(Error, number)} callback
   */
  getAvaliacaoPorProduto: (productId, callback) => {
    const sqlIds = 'SELECT id_avaliacao FROM avaliacao_produto WHERE id_produto = ?';
    db.query(sqlIds, [productId], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) {
        return callback(null, 0);
      }

      let totalStars = 0;
      let remaining = rows.length;

      rows.forEach(({ id_avaliacao }) => {
        const sqlVal = 'SELECT avaliacao FROM avaliacao WHERE id_avaliacao = ?';
        db.query(sqlVal, [id_avaliacao], (errVal, valRows) => {
          if (!errVal && valRows && valRows.length > 0) {
            totalStars += Number(valRows[0].avaliacao);
          }
          if (--remaining === 0) {
            const media = totalStars / rows.length;
            callback(null, media);
          }
        });
      });
    });
  }
};

module.exports = avaliacao_produto;
