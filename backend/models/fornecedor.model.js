const db = require("../db.js");
const Avaliacao_fornecedor = require("./avaliacao_fornecedor.model.js");
const Arquivos = require("./arquivos.model.js");

const Fornecedor = {
  // 1) Insere um novo fornecedor
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
        id_usuario, razao_social, nome_fantasia, cnpj,
        inscricao_estadual, inscricao_municipal, logradouro,
        numero, complemento, rep_nome, rep_cpf, rep_telefone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

  // 2) Retorna apenas a razão social pelo ID do usuário
  getNome: (idUsuario, callback) => {
    const sql = "SELECT razao_social FROM fornecedor WHERE id_usuario = ?";
    db.query(sql, [idUsuario], (err, results) => {
      if (err) return callback(err);
      if (!results?.length) return callback(null, null);
      callback(null, results[0].razao_social);
    });
  },

  // 3) Retorna perfil completo (basic + imagem + data + avaliação)
  getById: (idUsuario, callback) => {
    const sql = "SELECT id_usuario, nome_fantasia FROM fornecedor WHERE id_usuario = ?";
    db.query(sql, [idUsuario], (err, results) => {
      if (err) return callback(err);
      if (!results?.length) return callback(null, null);

      const fornecedor = results[0];
      enrichFornecedor(fornecedor, () => callback(null, fornecedor));
    });
  },

  // 4) Atualiza campos permitidos do fornecedor
  updateProfile: async (idUsuario, campos) => {
    const map = {
      razaoSocial:        "razao_social",
      nomeFantasia:       "nome_fantasia",
      inscricaoEstadual:  "inscricao_estadual",
      inscricaoMunicipal: "inscricao_municipal",
      logradouro:         "logradouro",
      numero:             "numero",
      complemento:        "complemento",
      repNome:            "rep_nome",
      repCpf:             "rep_cpf",
      repTelefone:        "rep_telefone"
    };

    const sets = [];
    const params = [];
    for (const [key, col] of Object.entries(map)) {
      if (campos[key] !== undefined) {
        sets.push(`${col} = ?`);
        params.push(campos[key]);
      }
    }

    if (sets.length) {
      params.push(idUsuario);
      const sql = `UPDATE fornecedor SET ${sets.join(", ")} WHERE id_usuario = ?`;
      await db.execute(sql, params);
    }
  }
};

/**
 * 5) Auxiliar: anexa imagem de perfil + dataCadastro
 *    e então chama fetchRating para avaliação média
 */
function enrichFornecedor(fornecedor, done) {
  const usuarioId = fornecedor.id_usuario;

  // 5-A) busca perfil_arquivo_id e dataCadastro em usuario
  db.query(
    "SELECT perfil_arquivo_id, dataCadastro FROM usuario WHERE id_usuario = ?",
    [usuarioId],
    (err, rows) => {
      if (err || !rows?.length) {
        fornecedor.imagem      = null;
        fornecedor.dataCadastro = null;
        return fetchRating(fornecedor, done);
      }

      const { perfil_arquivo_id, dataCadastro } = rows[0];
      fornecedor.dataCadastro = dataCadastro;

      // 5-B) busca o arquivo de imagem, se existir
      if (!perfil_arquivo_id) {
        return fetchRating(fornecedor, done);
      }
      Arquivos.getArqPorId(perfil_arquivo_id, (eArq, arq) => {
        if (!eArq && arq) fornecedor.imagem = arq;
        fetchRating(fornecedor, done);
      });
    }
  );
}

/**
 * 6) Auxiliar: busca avaliação média e anexa ao objeto
 */
function fetchRating(fornecedor, done) {
  Avaliacao_fornecedor.getAvaliacao(fornecedor.id_usuario, (errAvg, media) => {
    fornecedor.avaliacao_media = errAvg ? null : media;
    done();
  });
}

module.exports = Fornecedor;
