const db = require('../db.js');

const Compra = {
  /**
   * Remove uma compra pelo ID.
   * @param {number} id_compra
   * @returns {Promise<boolean>}
   */
  removerCompra: async (id_compra) => {
    const sql = `DELETE FROM compra WHERE id_compra = ?`;
    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [id_compra], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao remover compra:', error);
      return false;
    }
  },

  /**
   * Retorna a compra pelo ID do pedido.
   * @param {number} id_pedido
   * @returns {Promise<object[]|null>}
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
      return results && results.length ? results : null;
    } catch (err) {
      console.error('Erro ao buscar compras por pedido:', err);
      return null;
    }
  },

  /**
   * Cria uma nova compra.
   * @param {number} precoUnidade
   * @param {number} quantidade
   * @param {number} idProduto
   * @param {number} idPedido
   * @param {number} dividir
   * @returns {Promise<number|null>} id_compra
   */
  criarCompra: async (precoUnidade, quantidade, idProduto, idPedido, dividir) => {
    const sql = `
      INSERT INTO compra
        (preco_unidade, quantidade, estado, id_produto, id_pedido, dividir)
      VALUES (?, ?, 'CARRINHO', ?, ?, ?)
    `;
    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [precoUnidade, quantidade, idProduto, idPedido, dividir], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      return result.insertId;
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      return null;
    }
  },

  /**
   * Retorna a compra pelo seu ID.
   * @param {number} id_compra
   * @returns {Promise<object|null>}
   */
  getById: async (id_compra) => {
    const sql = 'SELECT * FROM compra WHERE id_compra = ?';
    try {
      const results = await new Promise((resolve, reject) => {
        db.query(sql, [id_compra], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (!results || results.length === 0) {
        return null;
      }
      return results[0];
    } catch (error) {
      console.error('Erro ao buscar compra por ID:', error);
      return null;
    }
  },

  /**
   * Atualiza campos de uma compra existente.
   * Campos aceitos: preco_unidade, quantidade, frete_pago, estado, id_conjunto.
   * @param {number} id_compra
   * @param {object} dados
   * @returns {Promise<boolean>}
   */
  atualizarCompra: async (id_compra, dados) => {
    const camposPermitidos = ['preco_unidade', 'quantidade', 'frete_pago', 'estado', 'id_conjunto'];
    const camposAtualizar = [];
    const valores = [];
    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        camposAtualizar.push(`${campo} = ?`);
        valores.push(dados[campo]);
      }
    }
    if (!camposAtualizar.length) {
      console.warn('Nenhum campo válido para atualizar.');
      return false;
    }
    const sql = `UPDATE compra SET ${camposAtualizar.join(', ')} WHERE id_compra = ?`;
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
      console.error('Erro ao atualizar compra:', error);
      return false;
    }
  }
};

module.exports = Compra;
