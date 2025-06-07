const db = require("../db.js");
const Avaliacao_fornecedor = require("./avaliacao_fornecedor.model.js");

const Fornecedor = {
  createFornecedor: async (data) => {
    const {
      idUsuario,
      razaoSocial,
      nomeFantasia,
      cnpj,
      inscricaoEstadual,
      inscricaoMunicipal,
      logradouro,
      numero,
      complemento,
      repNome,
      repCpf,
      repTelefone,
    } = data;

    const sql = `
      INSERT INTO fornecedor (
        id_usuario,
        razao_social,
        nome_fantasia,
        cnpj,
        inscricao_estadual,
        inscricao_municipal,
        logradouro,
        numero,
        complemento,
        rep_nome,
        rep_cpf,
        rep_telefone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      idUsuario,
      razaoSocial,
      nomeFantasia,
      cnpj,
      inscricaoEstadual,
      inscricaoMunicipal,
      logradouro,
      numero,
      complemento,
      repNome,
      repCpf,
      repTelefone,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  /**
   * Retorna a razão social do fornecedor pelo id do usuário
   * @param {number} idUsuario – ID do usuário vinculado ao fornecedor
   * @param {function(Error, string|null)} callback – (err, razao_social)
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
      return callback(null, results[0].razao_social);
    });
  },

  /**
   * Retorna um fornecedor completo (imagem, dataCadastro, avaliação média) pelo ID
   * @param {number} id – id_usuario do fornecedor
   * @param {(err: Error|null, fornecedor: object|null) => void} callback
   */
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
 * Função auxiliar para enriquecer um objeto fornecedor com:
 * – imagem de perfil (perfil_arquivo_id)
 * – dataCadastro do usuário
 * – avaliação média
 */
function enrichFornecedor(fornecedor, done) {
  const Arquivos = require("./arquivos.model.js");
  const usuarioId = fornecedor.id_usuario;

  const afterImageAndData = (image, dataCadastro) => {
    fornecedor.imagem = image || null;
    fornecedor.dataCadastro = dataCadastro || null;
    // Busca avaliação média
    fetchRating(fornecedor, done);
  };

  if (!usuarioId) {
    afterImageAndData(null, null);
  } else {
    // 1) Busca perfil_arquivo_id e dataCadastro na tabela usuario
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
 * @param {object} fornecedor – objeto que contém id_usuario
 * @param {() => void} done – callback para executar ao terminar
 */
function fetchRating(fornecedor, done) {
  Avaliacao_fornecedor.getAvaliacao(fornecedor.id_usuario, (errAvg, media) => {
    fornecedor.avaliacao_media = errAvg ? null : media;
    done();
  });
}

module.exports = Fornecedor;