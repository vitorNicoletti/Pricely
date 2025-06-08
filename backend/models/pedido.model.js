const db = require('../db.js');
const Arquivo = require('./arquivos.model.js');
const Compra = require('./compra.model.js');
const Produtos = require('./produtos.model.js');

const Pedido = {
  /**
   * Busca o pedido em estado "CARRINHO" para o vendedor,
   * recupera as compras desse pedido e retorna os produtos detalhados.
   * Se não encontrar o carrinho ou ocorrer erro, retorna null.
   */
  getCarrinhoPorIdVendedor: async (idVendedor) => {
    // 1) Buscar o carrinho (pedido em estado 'CARRINHO') para o vendedor
    const sql = "SELECT * FROM pedido WHERE id_vendedor = ? AND estado = 'CARRINHO'";
    let carrinho;
    try {
        
      const results = await new Promise((resolve, reject) => {
        db.query(sql, [idVendedor], (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      if (results.length === 0) {
        return null;
      }
      carrinho = results[0];
      console.log('Carrinho encontrado:', carrinho);
    } catch (err) {
      return null;
    }

    // 2) Buscar todas as compras vinculadas a esse pedido (carrinho)
    let listaCompras;
    try {
      listaCompras = await Compra.getCompraPorIdPedido(carrinho.id_pedido);
      if (listaCompras === null) {
        return null;
      }
    } catch {
      return null;
    }

    // O método getCompraPorIdPedido pode retornar um objeto único ou um array.
    // Garantimos que trabalhemos sempre com um array:
    const comprasArray = Array.isArray(listaCompras)
      ? listaCompras
      : [listaCompras];

    // 3) Para cada compra, buscar os detalhes do produto
    const comprasDetalhadas = await Promise.all(
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

    // 4) Retornar informação consolidada: carrinho + lista de compras com produtos
    return {
      carrinho,
      compras: comprasDetalhadas,
    };
  },
};

module.exports = Pedido;
