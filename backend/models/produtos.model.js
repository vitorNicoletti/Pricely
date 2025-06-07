const db = require('../db.js');
const Arquivos = require('./arquivos.model.js');
const Promocao = require('./promocao.model.js');
const Oferta = require('./oferta.model.js');
const Fornecedor = require('./fornecedor.model.js');
const AvaliacaoProduto = require('./avaliacao_produto.model.js');

const Produtos = {
  /**
   * Retorna todos os produtos, incluindo imagem, promoções, nome do fornecedor e avaliação média
   */
  getAll: (callback) => {
    const sql = 'SELECT * FROM produto';
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) return callback(null, []);

      let remaining = results.length;
      results.forEach((produto) => _enrichProduto(produto, () => {
        if (--remaining === 0) callback(null, results);
      }));
    });
  },

  /**
   * Retorna um produto por ID, incluindo imagem, promoções, nome do fornecedor e avaliação média
   */
  getById: (id, callback) => {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) return callback(null, null);

      const produto = results[0];
      _enrichProduto(produto, () => callback(null, produto));
    });
  }
};

/**
 * Função auxiliar para enriquecer um objeto produto com imagem, promoções, fornecedor e avaliação média
 */
function _enrichProduto(produto, done) {
  // 1) imagem
  const arquivoId = produto.imagem_arquivo_id;
  const afterImage = (image) => {
    produto.imagem = image || null;
    // 2) promoções
    Promocao.getPromocoesByProduct(produto.id_produto, (errPromo, promocoes) => {
      if (errPromo || !promocoes) {
        produto.promocoes = [];
        // mesmo sem promoções, busca avaliação
        return fetchRating(produto, done);
      }
      if (promocoes.length === 0) {
        produto.promocoes = [];
        return fetchRating(produto, done);
      }

      let countPromo = promocoes.length;
      produto.promocoes = [];
      promocoes.forEach((promo) => {
        Oferta.getIdFornecedorByOferta(promo.id_oferta, (errFor, id_fornecedor) => {
          if (errFor || !id_fornecedor) {
            produto.promocoes.push({ ...promo, id_fornecedor: null, nome_fornecedor: null });
            if (--countPromo === 0) fetchRating(produto, done);
          } else {
            Fornecedor.getNome(id_fornecedor, (errNome, nome) => {
              produto.promocoes.push({
                ...promo,
                id_fornecedor,
                nome_fornecedor: errNome ? null : nome
              });
              if (--countPromo === 0) fetchRating(produto, done);
            });
          }
        });
      });
    });
  };

  if (!arquivoId) {
    afterImage(null);
  } else {
    Arquivos.getArqPorId(arquivoId, (errArq, arquivo) => {
      afterImage(errArq ? null : arquivo);
    });
  }
}

/**
 * Busca avaliação média do produto e adiciona ao objeto
 */
function fetchRating(produto, done) {
  AvaliacaoProduto.getAvaliacaoPorProduto(produto.id_produto, (errAvg, media) => {
    produto.avaliacao_media = errAvg ? null : media;
    done();
  });
}

module.exports = Produtos;
