const db = require("../db.js");
const Avaliacao_fornecedor = require("./avaliacao_fornecedor.model.js");
// Fornecedor model
const Fornecedor = {
  /**
   * Retorna a razão social do fornecedor pelo id do usuário
   * @param {number} idUsuario - ID do usuário vinculado ao fornecedor
   * @param {function(Error, string|null)} callback - Callback com assinatura (err, razao_social)
   */
  getNome: (idUsuario, callback) => {
    const sql = "SELECT razao_social FROM fornecedor WHERE id_usuario = ?";
    db.query(sql, [idUsuario], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (!results || results.length === 0) {
        return callback(null, null);
      }
      // Retorna apenas a razão social
      return callback(null, results[0].razao_social);
    });
  },

  getById: (id, callback) => {
    const sql = "SELECT id_usuario, nome_fantasia FROM fornecedor WHERE id_usuario = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) return callback(null, null);

      const fornecedor = results[0];
      enrichFornecedor(fornecedor, () => callback(null, fornecedor));
    });
  },
};


/**
 * Função auxiliar para enriquecer um objeto fornecedor com avaliação média
 */
function enrichFornecedor(fornecedor, done) {
  // 1) imagem do perfil do usuário e dataCadastro
  const db = require("../db.js");
  const Arquivos = require('./arquivos.model.js');
  const usuarioId = fornecedor.id_usuario;
  const afterImageAndData = (image, dataCadastro) => {
    fornecedor.imagem = image || null;
    fornecedor.dataCadastro = dataCadastro || null;
    // 2) avaliação
    
    fetchRating(fornecedor, done);
  };

  if (!usuarioId) {
    afterImageAndData(null, null);
  } else {
    // Busca o perfil_arquivo_id e dataCadastro na tabela usuario
    const sql = "SELECT perfil_arquivo_id, dataCadastro FROM usuario WHERE id_usuario = ?";
    db.query(sql, [usuarioId], (err, results) => {
      if (err || !results || results.length === 0) {
        afterImageAndData(null, null);
      } else {
        const arquivoId = results[0].perfil_arquivo_id;
        const dataCadastro = results[0].dataCadastro;
        if (!arquivoId) {
          afterImageAndData(null, dataCadastro);
        } else {
          Arquivos.getArqPorId(arquivoId, (errArq, arquivo) => {
            afterImageAndData(errArq ? null : arquivo, dataCadastro);
          });
        }
      }
    });
  }
}

/**
 * Busca avaliação média do fornecedor e adiciona ao objeto
 */
function fetchRating(fornecedor, done) {
    Avaliacao_fornecedor.getAvaliacao(fornecedor.id_usuario, (errAvg, media) => {
    fornecedor.avaliacao_media = errAvg ? null : media;
    done();
  });
}


module.exports = Fornecedor;
