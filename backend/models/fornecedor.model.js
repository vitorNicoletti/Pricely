
const db = require('../db.js')
// Fornecedor model
const Fornecedor = {
  /**
   * Retorna a razão social do fornecedor pelo id do usuário
   * @param {number} idUsuario - ID do usuário vinculado ao fornecedor
   * @param {function(Error, string|null)} callback - Callback com assinatura (err, razao_social)
   */
  getNome: (idUsuario, callback) => {
    const sql = 'SELECT razao_social FROM fornecedor WHERE id_usuario = ?';
    db.query(sql, [idUsuario], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (!results || results.length === 0) {
        return callback(null, null);
      }
      // Retorna apenas a razão social
      return callback(null, results[0].razao_social);
    });
  }
};

module.exports.Fornecedor = Fornecedor;
