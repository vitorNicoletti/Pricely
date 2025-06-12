const db = require("../db.js");

const Carteira = {
  /**
   * Cria uma carteira associada a um Vendedor.
   */
  createCarteira: async (id_usuario) => {
    const sql =
      "INSERT INTO carteira (saldo,ultima_atualizacao,id_usuario) VALUES (0,NOW(),?)";
    const [result] = await db.promise().query(sql, [id_usuario]);
    return result.insertId;
  },
};

module.exports = Carteira;
