
const db = require('../db.js');
const Arquivos = require('./arquivos.model.js');

const Produtos = {
  // 1) Pega todos os produtos, incluindo imagens
  getAll: (callback) => {
    const sql = 'SELECT * FROM produto';
    db.query(sql, (err, results) => {
      if (err) return callback(err);

      // Se não houver produtos, retorna array vazio
      if (!results || results.length === 0) {
        return callback(null, []);
      }

      // Para cada produto, buscar a imagem associada
      let count = results.length;
      results.forEach((produto) => {
        const arquivoId = produto.imagem_arquivo_id;
        if (!arquivoId) {
          produto.imagem = null;
          if (--count === 0) callback(null, results);
        } else {
          Arquivos.getArqPorId(arquivoId, (errArq, arquivo) => {
            if (errArq) {
              // Em caso de erro com um arquivo, podemos definir imagem como null
              produto.imagem = null;
            } else {
              produto.imagem = arquivo;
            }
            if (--count === 0) callback(null, results);
          });
        }
      });
    });
  },

  // 2) Pega um produto por ID, incluindo a imagem (arquivo)
  getById: (id, callback) => {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);

      const produto = results[0];
      const arquivoId = produto.imagem_arquivo_id;

      if (!arquivoId) {
        return callback(null, produto);
      }

      Arquivos.getArqPorId(arquivoId, (errArq, arquivo) => {
        if (errArq) return callback(errArq);
        produto.imagem = arquivo;
        callback(null, produto);
      });
    });
  }
};

module.exports = Produtos;
