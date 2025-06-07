const db = require('../db.js');

const Compra = {
  /**
   * Retorna a compra pelo ID do pedido. 
   * Se não encontrar ou ocorrer erro, retorna null.
   */
  getCompraPorIdPedido: async (id_pedido) => {
    const sql = 'SELECT * FROM compra WHERE id_pedido = ?';

    try {
      const results = await new Promise((resolve, reject) => {
        db.query(sql, [id_pedido], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      if (!results || results.length === 0) {
        return null;
      }

      return results[0];
    } catch (err) {
      return null;
    }
  }
};

module.exports = Compra;
