const db = require('../db.js');
const ProdOferta = require('./produto_oferta.model.js');

const Promocao = {
  /**
   * Retorna todas as promoções (grupo_promocao) associadas ao produto informado.
   * Primeiro busca a oferta vinculada ao produto e, então, todas as entradas em grupo_promocao.
   *
   * @param {number} productId - ID do produto
   * @param {function(Error, array)} callback - callback com assinatura (err, resultados)
   */
  getPromocoesByProduct: (productId, callback) => {
    // 1) Buscar oferta associada ao produto
    ProdOferta.getOfertaByProduct(productId, (err, oferta) => {
      if (err) {
        return callback(err);
      }
      // Se não houver oferta, retorna lista vazia
      if (!oferta || (!oferta.id_oferta && typeof oferta !== 'number')) {
        return callback(null, []);
      }

      // Se getOfertaByProduct retornou um objeto, extrai id_oferta
      const ofertaId = typeof oferta === 'number' ? oferta : oferta.id_oferta;
      // 2) Buscar promoções no grupo_promocao
      const sql = 'SELECT * FROM grupo_promocao WHERE id_oferta = ?';
      db.query(sql, [ofertaId], (err, results) => {
        if (err) {
          return callback(err);
        }
        // Retorna array de promoções (pode ser vazio)
        return callback(null, results);
      });
    });
  }
};

module.exports = Promocao;
