const db = require("../db.js");
const Avaliacao_fornecedor = require("./avaliacao_fornecedor.model.js");
const Arquivos = require("./arquivos.model.js");
const bcrypt = require("bcrypt");

const Fornecedor = {
  // 1) Cria novo fornecedor
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

  // 2) Razão social
  getNome: (idUsuario, callback) => {
    db.query(
      "SELECT razao_social FROM fornecedor WHERE id_usuario = ?",
      [idUsuario],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results?.[0]?.razao_social || null);
      }
    );
  },

  // 3) Perfil completo
  getById: (idUsuario) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id_usuario, nome_fantasia FROM fornecedor WHERE id_usuario = ?",
        [idUsuario],
        (err, results) => {
          if (err) return reject(err);
          if (!results?.length) return resolve(null);
          const fornecedor = results[0];
          enrichFornecedor(fornecedor, () => resolve(fornecedor));
        }
      );
    });
  },

  // 4) Atualiza apenas campos da tabela fornecedor
  updateProfile: async (idUsuario, campos) => {
    const map = {
      razaoSocial: "razao_social",
      nomeFantasia: "nome_fantasia",
      inscricaoEstadual: "inscricao_estadual",
      inscricaoMunicipal: "inscricao_municipal",
      logradouro: "logradouro",
      numero: "numero",
      complemento: "complemento",
      repNome: "rep_nome",
      repCpf: "rep_cpf",
      repTelefone: "rep_telefone",
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
  },

  // 5) Atualiza dados na tabela usuario (email, telefone, senha, imagem, documento)
  updateUser: async (idUsuario, { email, telefone, senha, imagemBase64, imagemTipo, documentoBase64, documentoTipo }) => {
    // Busca senha atual
    const [[uRow]] = await db.promise().query(
      "SELECT email, senha FROM usuario WHERE id_usuario = ?", [idUsuario]
    );
    // Senha obrigatória para atualizações
    if (!senha) throw new Error("Senha obrigatória para atualizar perfil");
    const valid = await bcrypt.compare(senha, uRow.senha);
    if (!valid) throw new Error("Senha incorreta");

    // a) e-mail
    if (email) {
      await db.promise().query(
        "UPDATE usuario SET email = ? WHERE id_usuario = ?", [email, idUsuario]
      );
    }
    // b) telefone
    if (telefone) {
      await db.promise().query(
        "UPDATE usuario SET telefone = ? WHERE id_usuario = ?", [telefone, idUsuario]
      );
    }
    // c) imagem de perfil
    if (imagemBase64 && imagemTipo) {
      const nomeImg = `perfil_${idUsuario}`;
      const [r] = await db.promise().query(
        "INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)",
        [nomeImg, imagemTipo, imagemBase64]
      );
      await db.promise().query(
        "UPDATE usuario SET perfil_arquivo_id = ? WHERE id_usuario = ?",
        [r.insertId, idUsuario]
      );
    }
    // d) documento
    if (documentoBase64 && documentoTipo) {
      const nomeDoc = `documento_perfil_${idUsuario}`;
      const [rD] = await db.promise().query(
        "INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)",
        [nomeDoc, documentoTipo, documentoBase64]
      );
      await db.promise().query(
        "UPDATE usuario SET documento_arquivo_id = ? WHERE id_usuario = ?",
        [rD.insertId, idUsuario]
      );
    }
  }
};

// 5) Enriquecer com imagem de perfil e dataCadastro, depois avaliação
async function enrichFornecedor(fornecedor, done) {
  const usuarioId = fornecedor.id_usuario;
  try {
    const [rows] = await db.promise().query(
      "SELECT perfil_arquivo_id, dataCadastro FROM usuario WHERE id_usuario = ?",
      [usuarioId]
    );
    if (!rows.length) {
      fornecedor.imagem = null;
      fornecedor.dataCadastro = null;
      return fetchRating(fornecedor, done);
    }
    const { perfil_arquivo_id, dataCadastro } = rows[0];
    fornecedor.dataCadastro = dataCadastro;
    if (perfil_arquivo_id) {
      const arq = await Arquivos.getArqPorId(perfil_arquivo_id);
      if (arq) fornecedor.imagem = arq;
    }
    return fetchRating(fornecedor, done);
  } catch (err) {
    console.error(err);
    fornecedor.imagem = null;
    fornecedor.dataCadastro = null;
    return fetchRating(fornecedor, done);
  }
}

// 6) Anexa avaliação média
function fetchRating(fornecedor, done) {
  Avaliacao_fornecedor.getAvaliacao(fornecedor.id_usuario, (errAvg, media) => {
    fornecedor.avaliacao_media = errAvg ? null : media;
    done();
  });
}

module.exports = Fornecedor;