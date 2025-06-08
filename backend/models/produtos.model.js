const db = require('../db.js');
const Arquivos = require('./arquivos.model.js');
const Promocao = require('./promocao.model.js');
const Oferta = require('./oferta.model.js');
const Fornecedor = require('./fornecedor.model.js');
const AvaliacaoProduto = require('./avaliacao_produto.model.js');

/**
 * Enriquecer um produto com:
 *  1) imagem (arquivo)
 *  2) lista de promoções (com id_fornecedor + nome_fornecedor)
 *  3) avaliação média
 *
 * Retorna uma Promise que resolve quando todos os dados forem ligados ao objeto `produto`.
 */
async function enrichProduto(produto) {
  // 1) imagem
  produto.imagem = null;
  if (produto.imagem_arquivo_id) {
    try {
      const arquivo = await Arquivos.getArqPorId(produto.imagem_arquivo_id);
      produto.imagem = arquivo || null;
    } catch (err) {
      produto.imagem = null;
    }
  }

  // 2) promoções
  produto.promocoes = [];
  try {
    // transformar a chamada em callback numa Promise
    const promocoes = await new Promise((resolve, reject) => {
      Promocao.getPromocoesByProduct(produto.id_produto, (err, lista) => {
        if (err) return reject(err);
        resolve(lista || []);
      });
    });

    // Se não há nenhuma promoção, a lista já fica vazia
    for (const promo of promocoes) {
      let idFornecedor = null;
      let nomeFornecedor = null;

      // obter id_fornecedor via Oferta.getIdFornecedorByOferta
      try {
        idFornecedor = await new Promise((resolve, reject) => {
          Oferta.getIdFornecedorByOferta(promo.id_oferta, (err, idF) => {
            if (err) return reject(err);
            resolve(idF);
          });
        });
      } catch {
        idFornecedor = null;
      }

      // se achou algum id_fornecedor, pega o nome
      if (idFornecedor) {
        try {
          nomeFornecedor = await new Promise((resolve, reject) => {
            Fornecedor.getNome(idFornecedor, (err, nome) => {
              if (err) return reject(err);
              resolve(nome);
            });
          });
        } catch {
          nomeFornecedor = null;
        }
      }

      produto.promocoes.push({
        ...promo,
        id_fornecedor: idFornecedor || null,
        nome_fornecedor: nomeFornecedor || null
      });
    }

  } catch (err) {
    // em caso de erro ao buscar promoções, deixamos lista vazia
    produto.promocoes = [];
  }

  // 3) avaliação média
  produto.avaliacao_media = null;
  try {
    const media = await new Promise((resolve, reject) => {
      AvaliacaoProduto.getAvaliacaoPorProduto(produto.id_produto, (err, avg) => {
        if (err) return reject(err);
        resolve(avg);
      });
    });
    produto.avaliacao_media = media;
  } catch {
    produto.avaliacao_media = null;
  }

  // quando chegar aqui, `produto` já está totalmente “enriquecido”
  return produto;
}

const Produtos = {
  /**
   * Retorna todos os produtos, enriquecendo cada um (imagem, promoções, avaliação).
   * Chama callback(err, [produto, ...]) quando pronto.
   */
  getAll: (callback) => {
    const sql = 'SELECT * FROM produto';
    db.query(sql, async (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) {
        return callback(null, []);
      }

      try {
        // Promessa que enriquece cada produto
        await Promise.all(results.map((p) => enrichProduto(p)));
        callback(null, results);
      } catch (erroEnriquecimento) {
        callback(erroEnriquecimento);
      }
    });
  },

  /**
   * Retorna um produto pelo ID, enriquecido (imagem, promoções, avaliação).
   * Chama callback(err, produtoOuNull) quando pronto.
   */
  getById: (id, callback) => {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?';
    db.query(sql, [id], async (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) {
        return callback(null, null);
      }

      const produto = results[0];
      try {
        await enrichProduto(produto);
        callback(null, produto);
      } catch (erroEnriquecimento) {
        callback(erroEnriquecimento);
      }
    });
  }
};

module.exports = Produtos;
