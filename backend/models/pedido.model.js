const db = require('../db.js');
const Arquivo = require('./arquivos.model.js');
const Compra = require('./compra.model.js');
const Produtos = require('./produtos.model.js');

const Pedido = {
  /**
   * Busca um único pedido pelo seu ID, com todas as compras detalhadas.
   * @param {number} id_pedido
   * @returns {Promise<{pedido: object, compras: object[]} | null>}
   */
  getPedidoPorId: async (id_pedido,id_usuario) => {
    const sqlPedido = `SELECT * FROM pedido WHERE id_pedido = ? AND id_vendedor= ?`;

    // 1) Busca o pedido
    let pedido;
    try {
      const results = await new Promise((resolve, reject) => {
        db.query(sqlPedido, [id_pedido,id_usuario], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (!results || results.length === 0) return null;
      pedido = results[0];
    } catch (err) {
      console.error(`Erro ao buscar pedido ${id_pedido}:`, err);
      return null;
    }

    // 2) Busca as compras deste pedido
    let comprasDetalhadas = [];
    try {
      const listaCompras = await Compra.getCompraPorIdPedido(id_pedido);
      const comprasArray = Array.isArray(listaCompras)
        ? listaCompras
        : listaCompras
          ? [listaCompras]
          : [];

      comprasDetalhadas = await Promise.all(
        comprasArray.map(async (compra) => {
          let produtoDetalhado = null;
          try {
            produtoDetalhado = await Produtos.getById(compra.id_produto);
          } catch {
            produtoDetalhado = null;
          }
          return {
            ...compra,
            produto: produtoDetalhado,
          };
        })
      );
    } catch (err) {
      console.error(`Erro ao buscar compras do pedido ${id_pedido}:`, err);
      comprasDetalhadas = [];
    }

    return {
      pedido,
      compras: comprasDetalhadas,
    };
  },
  getPedidoDetalhadoPorEstado: async (idVendedor, estado) => {
    const sql = "SELECT * FROM pedido WHERE id_vendedor = ? AND estado = ?";

    try {
      const pedidos = await new Promise((resolve, reject) => {
        db.query(sql, [idVendedor, estado], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      if (!pedidos || pedidos.length === 0) return [];

      const pedidosDetalhados = await Promise.all(
        pedidos.map(async (pedido) => {
          let comprasDetalhadas = [];

          try {
            const listaCompras = await Compra.getCompraPorIdPedido(pedido.id_pedido);
            const comprasArray = Array.isArray(listaCompras)
              ? listaCompras
              : listaCompras
                ? [listaCompras]
                : [];

            comprasDetalhadas = await Promise.all(
              comprasArray.map(async (compra) => {
                let produtoDetalhado = null;
                try {
                  produtoDetalhado = await Produtos.getById(compra.id_produto);
                } catch {
                  produtoDetalhado = null;
                }
                return {
                  ...compra,
                  produto: produtoDetalhado,
                };
              })
            );
          } catch (err) {
            console.error("Erro ao buscar compras:", err);
          }

          return {
            pedido,
            compras: comprasDetalhadas,
          };
        })
      );

      return pedidosDetalhados;
    } catch (err) {
      console.error(`Erro ao buscar pedidos com estado ${estado}:`, err);
      return [];
    }
  },


  getCarrinhoPorIdVendedor: async (idVendedor) => {
    return await Pedido.getPedidoDetalhadoPorEstado(idVendedor, 'CARRINHO');
  },

  /*Fiz aqui mas testem se não quebrou nada*/

  getPedidosExcetoCarrinho: async (idVendedor) => {
    const sql = "SELECT * FROM pedido WHERE id_vendedor = ? AND estado != 'CARRINHO'";

    try {
      const pedidos = await new Promise((resolve, reject) => {
        db.query(sql, [idVendedor], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      if (!pedidos || pedidos.length === 0) return [];

      const pedidosDetalhados = await Promise.all(
        pedidos.map(async (pedido) => {
          let comprasDetalhadas = [];

          try {
            const listaCompras = await Compra.getCompraPorIdPedido(pedido.id_pedido);
            const comprasArray = Array.isArray(listaCompras)
              ? listaCompras
              : listaCompras
                ? [listaCompras]
                : [];

            comprasDetalhadas = await Promise.all(
              comprasArray.map(async (compra) => {
                let produtoDetalhado = null;
                try {
                  produtoDetalhado = await Produtos.getById(compra.id_produto);
                } catch {
                  produtoDetalhado = null;
                }
                return {
                  ...compra,
                  produto: produtoDetalhado,
                };
              })
            );
          } catch (err) {
            console.error("Erro ao buscar compras:", err);
          }

          return {
            pedido,
            compras: comprasDetalhadas,
          };
        })
      );

      return pedidosDetalhados;
    } catch (err) {
      console.error(`Erro ao buscar pedidos do vendedor (exceto carrinho):`, err);
      return [];
    }
  },

  getPedidosPorIdVendedor: async (idVendedor) => {
  return await Pedido.getPedidosExcetoCarrinho(idVendedor);
},

  /**
   * Atualiza campos de um pedido existente.
   * Campos aceitos: rua, numero, complemento, cep, estado.
   *
   * @param {number} id_pedido - ID do pedido a ser atualizado.
   * @param {object} dados - Objeto com os campos a serem atualizados.
   * @returns {Promise<boolean>} true se atualizou ≥1 linha, false caso contrário.
   */
  atualizarPedido: async (id_pedido, dados) => {
    const camposPermitidos = ['rua', 'numero', 'complemento', 'cep', 'estado'];
    const camposAtualizar = [];
    const valores = [];

    for (const campo of camposPermitidos) {
      if (dados[campo] !== undefined) {
        camposAtualizar.push(`${campo} = ?`);
        valores.push(dados[campo]);
      }
    }

    if (camposAtualizar.length === 0) {
      console.warn("Nenhum campo válido para atualizar no pedido.");
      return false;
    }

    const sql = `
      UPDATE pedido
      SET ${camposAtualizar.join(', ')}
      WHERE id_pedido = ?
    `;
    valores.push(id_pedido);

    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, valores, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      return false;
    }
  },
  /**
   * Busca o pedido em estado "CARRINHO" para o vendedor,
   * recupera as compras desse pedido e retorna os produtos detalhados.
   * Se não encontrar o carrinho ou ocorrer erro, retorna null.
   */
  // Refatorada: só cuida da lógica geral e delega a criação
  addProduto: async (idPedido, idProduto, quantidade, dividir) => {

    try {
      const produtoInfo = await Produtos.getById(idProduto);

      if (!produtoInfo || typeof produtoInfo.preco_unidade !== 'number') {
        throw new Error("Produto não encontrado ou sem preço definido.");
      }
      return await Compra.criarCompra(produtoInfo.preco_unidade, quantidade, idProduto, idPedido, dividir);

    } catch (error) {
      console.error("Erro ao adicionar produto ao pedido:", error);
      return null;
    }
  },

  createCarrinho: async (idVendedor) => {
    const sql = `
    INSERT INTO pedido 
      (dataCadastro, desconto, id_vendedor, cep, metodo_pagamento, estado)
    VALUES
      (NOW(), 0, ?, '', 'carteira', 'CARRINHO')
  `;

    try {
      const result = await new Promise((resolve, reject) => {
        db.query(sql, [idVendedor], (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      // Retornar o pedido recém-criado
      const id_pedido = result.insertId;
      const [novoPedido] = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM pedido WHERE id_pedido = ?', [id_pedido], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      return { carrinho: novoPedido };

    } catch (error) {
      console.error("Erro ao criar carrinho:", error);
      return null;
    }
  }

}
module.exports = Pedido;
