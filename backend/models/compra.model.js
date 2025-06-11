const db = require('../db.js');

const Compra = {
  /**
   * Retorna a compra pelo ID do pedido. 
   * Se não encontrar ou ocorrer erro, retorna null.
   */
  criarCompra: async (precoUnidade, quantidade, idProduto, idPedido,dividir) => {
    const sql = `
      INSERT INTO compra 
        (preco_unidade, quantidade, estado, id_produto, id_pedido,dividir)
      VALUES (?, ?, 'CARRINHO', ?, ?,?)
    `;

    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [precoUnidade, quantidade, idProduto, idPedido,dividir], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar compra:", error);
      return null;
    }
  },
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
