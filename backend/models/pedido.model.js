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
  // Refatorada: só cuida da lógica geral e delega a criação
  addProduto: async (idPedido, idProduto, quantidade,dividir) => {

    try {
      const produtoInfo = await Produtos.getById(idProduto);

      if (!produtoInfo || typeof produtoInfo.preco_unidade !== 'number') {
        throw new Error("Produto não encontrado ou sem preço definido.");
      }
      return await Compra.criarCompra(produtoInfo.preco_unidade, quantidade, idProduto, idPedido,dividir);

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

    return {carrinho:novoPedido};

  } catch (error) {
    console.error("Erro ao criar carrinho:", error);
    return null;
  }
},

getCarrinhoPorIdVendedor: async (idVendedor) => {
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
      return null; // Não existe carrinho
    }

    carrinho = results[0];
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    return null;
  }

  let comprasDetalhadas = [];

  try {
    const listaCompras = await Compra.getCompraPorIdPedido(carrinho.id_pedido);

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
    comprasDetalhadas = [];
  }

  return {
    carrinho,
    compras: comprasDetalhadas,
  };
},

}
module.exports = Pedido;
