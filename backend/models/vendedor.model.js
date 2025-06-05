const db = require("../db.js");

const Vendedor = {
  getAll: (callback) => {
    const sql = "SELECT * FROM vendedor";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  getById: (idUsuario, callback) => {
    const sql = "SELECT * FROM vendedor WHERE id_usuario = ?";
    db.query(sql, [idUsuario], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) return callback(null, null);
      return callback(null, results[0]);
    });
  }
};

module.exports = Vendedor;
