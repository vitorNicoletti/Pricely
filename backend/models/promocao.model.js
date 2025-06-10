const db = require('../db.js');
const ProdOferta = require('./produto_oferta.model.js');

const Promocao = {
  /**
   * Retorna todas as promoções (grupo_promocao) associadas ao produto informado.
   * Primeiro busca a oferta vinculada ao produto e, então, todas as entradas em grupo_promocao.
   *
   * @param {number} productId - ID do produto
   * @returns {Promise<Array>} - Promise que resolve para o array de promoções
   */
  getPromocoesByProduct: async (productId) => {
    // 1) Buscar oferta associada ao produto
    const oferta = await new Promise((resolve, reject) => {
      ProdOferta.getOfertaByProduct(productId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Se não houver oferta, retorna lista vazia
    const ofertaId =
      !oferta || (typeof oferta !== 'number' && !oferta.id_oferta)
        ? null
        : (typeof oferta === 'number' ? oferta : oferta.id_oferta);
    if (!ofertaId) {
      return [];
    }

    // 2) Buscar promoções no grupo_promocao
    const sql = 'SELECT * FROM grupo_promocao WHERE id_oferta = ?';
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [ofertaId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    return results;
  }
};

module.exports = Promocao;
