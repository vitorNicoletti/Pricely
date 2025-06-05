const db = require('../db.js');


const Avaliacao_fornecedor = {
   /**
   * Busca todas as avaliações (estrelas) de um fornecedor e retorna a média
   * @param {number} fornecedorId - ID do fornecedor
   * @param {function(Error, number)} callback - Callback com assinatura (err, media)
   */
  getAvaliacao: (fornecedorId, callback) => {
    const sqlIds = 'SELECT id_avaliacao FROM avaliacao_fornecedor WHERE id_fornecedor = ?';
    db.query(sqlIds, [fornecedorId], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) {
        // Sem avaliações, retorna média zero
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
          // Ao processar todas, calcula média
          if (--remaining === 0) {
            const media = totalStars / rows.length;
            callback(null, media);
          }
        });
      });
    });
  }
};

module.exports = Avaliacao_fornecedor;
