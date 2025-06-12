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

  /**
   * Adiciona Saldo a uma Carteira
   */
  alterCarteiraBalance: async (id_usuario, valor) => {
    const sql =
      "UPDATE	carteira SET saldo = saldo + ?, ultima_atualizacao = NOW() where	id_usuario = ?;";
    const [result] = await db.promise().query(sql, [valor, id_usuario]);
    return result.affectedRows;
  },
  
};

module.exports = Carteira;
