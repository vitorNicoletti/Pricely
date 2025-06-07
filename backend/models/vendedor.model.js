const db       = require("../db.js");
const Arquivos = require("./arquivos.model.js");
const Usuario  = require("./usuario.model.js");
const bcrypt   = require("bcrypt");

const Vendedor = {
  // 1) Cria usuário + vendedor
  createVendedor: async (email, senha, cpfCnpj) => {
    const usuarioId = await Usuario.create(email, senha);
    await db.execute(
      "INSERT INTO vendedor (id_usuario, cpfCnpj) VALUES (?, ?)",
      [usuarioId, cpfCnpj]
    );
    return usuarioId;
  },

  // 2) Retorna perfil completo
  getById: (idUsuario, callback) => {
    const sql = `
      SELECT u.id_usuario, u.email, u.dataCadastro, u.telefone,
             u.perfil_arquivo_id, u.documento_arquivo_id, v.cpfCnpj
        FROM usuario AS u
       INNER JOIN vendedor AS v ON u.id_usuario = v.id_usuario
       WHERE u.id_usuario = ?`;
    db.query(sql, [idUsuario], (e, r) => {
      if (e) return callback(e);
      if (!r?.length) return callback(null, null);

      const row = r[0];
      const perfil = {
        id_usuario: row.id_usuario,
        email: row.email,
        dataCadastro: row.dataCadastro,
        telefone: row.telefone,
        perfil_arquivo_id: row.perfil_arquivo_id,
        documento_arquivo_id: row.documento_arquivo_id,
        cpfCnpj: row.cpfCnpj,
        imagemPerfil: null,
        documentoPerfil: null,
        carteira: null,
        infoBancaria: null
      };

      // carteira
      db.query(
        "SELECT id_carteira, saldo, ultima_atualizacao FROM carteira WHERE id_usuario = ?",
        [idUsuario],
        (e2, c) => {
          if (e2) return callback(e2);
          if (c?.length) perfil.carteira = c[0];

          // info_bancaria
          db.query(
            "SELECT id_info_banco, banco, agencia, conta, tipo_conta, pix FROM info_bancaria WHERE id_user = ?",
            [idUsuario],
            (e3, b) => {
              if (e3) return callback(e3);
              if (b?.length) perfil.infoBancaria = b[0];

              // arquivos
              const finish = () => callback(null, perfil);

              const fetchDoc = () => {
                if (!perfil.documento_arquivo_id) return finish();
                Arquivos.getArqPorId(perfil.documento_arquivo_id, (eD, doc) => {
                  if (!eD && doc) perfil.documentoPerfil = doc;
                  finish();
                });
              };

              if (!perfil.perfil_arquivo_id) return fetchDoc();
              Arquivos.getArqPorId(perfil.perfil_arquivo_id, (eI, img) => {
                if (!eI && img) perfil.imagemPerfil = img;
                fetchDoc();
              });
            }
          );
        }
      );
    });
  },

  // 3) Atualiza dados (email, telefone, senha, imagem, documento)
  updateProfile: async (
    idUsuario,
    {
      email,
      telefone,
      senha,
      imagemBase64,
      imagemTipo,
      documentoBase64,
      documentoTipo
    }
  ) => {
    // a) pega email atual → gera username
    const [[uRow]] = await db.execute(
      "SELECT email FROM usuario WHERE id_usuario = ?",
      [idUsuario]
    );
    const baseUser = (uRow?.email || "").split("@")[0] || `user${idUsuario}`;

    // b) email
    if (email) {
      const [dup] = await db.execute(
        "SELECT 1 FROM usuario WHERE email = ? AND id_usuario <> ?",
        [email, idUsuario]
      );
      if (dup.length) throw new Error("Email já utilizado");
      await db.execute(
        "UPDATE usuario SET email = ? WHERE id_usuario = ?",
        [email, idUsuario]
      );
    }

    // c) telefone
    if (telefone) {
      await db.execute(
        "UPDATE usuario SET telefone = ? WHERE id_usuario = ?",
        [telefone, idUsuario]
      );
    }

    // d) senha
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);
      await db.execute(
        "UPDATE usuario SET senha = ?, salt = ? WHERE id_usuario = ?",
        [hash, salt, idUsuario]
      );
    }

    // e) imagem de perfil
    if (imagemBase64 && imagemTipo) {
      const nomeImg = `perfil_${baseUser}`;
      const [r] = await db.execute(
        "INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)",
        [nomeImg, imagemTipo, imagemBase64]
      );
      await db.execute(
        "UPDATE usuario SET perfil_arquivo_id = ? WHERE id_usuario = ?",
        [r.insertId, idUsuario]
      );
    }

    // f) documento (pdf, etc.)
    if (documentoBase64 && documentoTipo) {
      const nomeDoc = `documento_perfil_${baseUser}`;
      const [rD] = await db.execute(
        "INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)",
        [nomeDoc, documentoTipo, documentoBase64]
      );
      await db.execute(
        "UPDATE usuario SET documento_arquivo_id = ? WHERE id_usuario = ?",
        [rD.insertId, idUsuario]
      );
    }
  }
};

module.exports = Vendedor;