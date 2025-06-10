const db = require('../db.js');

const Oferta = {
  /**
   * Retorna o id do fornecedor para uma oferta.
   *
   * @param {number} id - ID da oferta
   * @returns {Promise<number|null>} - resolve para id_fornecedor ou null se não encontrado
   */
  getIdFornecedorByOferta: async (id) => {
    const sql = 'SELECT id_fornecedor FROM oferta WHERE id_oferta = ?';
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!results || results.length === 0) {
      return null;
    }

    return results[0].id_fornecedor;
  }
};

module.exports = Oferta;
