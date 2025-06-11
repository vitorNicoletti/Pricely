const db = require('../db.js');

const Compra = {
  /**
   * Retorna a compra pelo ID do pedido. 
   * Se não encontrar ou ocorrer erro, retorna null.
   */
  criarCompra: async (precoUnidade, quantidade, idProduto, idPedido) => {
    const sql = `
      INSERT INTO compra 
        (preco_unidade, quantidade, estado, id_produto, id_pedido)
      VALUES (?, ?, 'CARRINHO', ?, ?)
    `;

    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [precoUnidade, quantidade, idProduto, idPedido], (err, res) => {
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
  },

  /**
   * Atualiza campos de uma compra existente.
   * Campos aceitos: preco_unidade, quantidade, frete_pago, estado.
   * @param {number} id_compra - ID da compra a ser atualizada.
   * @param {object} dados - Objeto com os campos a serem atualizados.
   */
  atualizarCompra: async (id_compra, dados) => {
    const camposPermitidos = ['preco_unidade', 'quantidade', 'frete_pago', 'estado'];
    const camposAtualizar = [];
    const valores = [];

    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        camposAtualizar.push(`${campo} = ?`);
        valores.push(dados[campo]);
      }
    }

    if (camposAtualizar.length === 0) {
      console.warn("Nenhum campo válido para atualizar.");
      return false;
    }

    const sql = `
      UPDATE compra
      SET ${camposAtualizar.join(', ')}
      WHERE id_compra = ?
    `;

    valores.push(id_compra);

    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, valores, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar compra:", error);
      return false;
    }
  }
};

module.exports = Compra;
