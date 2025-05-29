const db = require('../db.js');

const Oferta = {
  getIdFornecedorByOferta: (id, callback) => {
    const sql = 'SELECT id_fornecedor FROM oferta WHERE id_oferta = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }

      if (!results || results.length === 0) {
        // Se preferir, retorne um erro 404 em vez de null
        return callback(null, null);
      }

      // Retorna apenas o id_fornecedor
      return callback(null, results[0].id_fornecedor);
    });
  }
};

module.exports = Oferta;
