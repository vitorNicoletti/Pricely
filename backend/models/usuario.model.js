const db = require("../db.js");
const bcrypt = require("bcrypt");

const Usuario = {
  getUserByEmail: async (email) => {
    const sql = "SELECT * FROM usuario WHERE email = ?";
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results || []);
      });
    });
  },

  create: async (email, senha, telefone) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(senha, salt);
    const sql = "INSERT INTO usuario (email, senha, salt, telefone, dataCadastro) VALUES (?, ?, ?, ?, NOW())";
    return new Promise((resolve, reject) => {
      db.query(sql, [email, hashedPassword, salt, telefone], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },
};

module.exports = Usuario;