const db = require("../db.js");
const Arquivos = require("./arquivos.model.js");
const Usuario = require("./usuario.model.js");

const Vendedor = {
  /**
   * Criação de vendedor com base em usuário
   * @returns {Promise<number>} → ID do usuário recém-criado
   */
  // 1) Cria usuário + registro em `vendedor`
  createVendedor: async (email, senha, cpfCnpj) => {
    // 1. Cria o usuário
    const usuarioId = await Usuario.create(email, senha);
    // 2. Insere o vendedor
    await db.execute(
      "INSERT INTO vendedor (id_usuario, cpfCnpj) VALUES (?, ?)",
      [usuarioId, cpfCnpj]
    );
    // 3. Retorna o ID do novo usuário (vendedor)
    return usuarioId;
  },

  // 2) Busca perfil completo
  getById: (idUsuario, callback) => {
    const sql = `
      SELECT u.id_usuario, u.email, u.dataCadastro, u.telefone,
             u.perfil_arquivo_id, u.documento_arquivo_id, v.cpfCnpj
        FROM usuario AS u
  INNER JOIN vendedor AS v ON u.id_usuario = v.id_usuario
       WHERE u.id_usuario = ?`;
    db.query(sql, [idUsuario], (err, rows) => {
      if (err) return callback(err);
      if (!rows?.length) return callback(null, null);

      const row = rows[0];
      const perfil = {
        id_usuario:           row.id_usuario,
        email:                row.email,
        dataCadastro:         row.dataCadastro,
        telefone:             row.telefone,
        perfil_arquivo_id:    row.perfil_arquivo_id,
        documento_arquivo_id: row.documento_arquivo_id,
        cpfCnpj:              row.cpfCnpj,
        imagemPerfil:         null,
        documentoPerfil:      null,
        carteira:             null,
        infoBancaria:         null
      };

      // dados de carteira
      db.query(
        "SELECT id_carteira, saldo, ultima_atualizacao FROM carteira WHERE id_usuario = ?",
        [idUsuario],
        (e2, cRows) => {
          if (e2) return callback(e2);
          if (cRows?.length) perfil.carteira = cRows[0];

          // dados bancários
          db.query(
            "SELECT id_info_banco, banco, agencia, conta, tipo_conta, pix FROM info_bancaria WHERE id_user = ?",
            [idUsuario],
            (e3, bRows) => {
              if (e3) return callback(e3);
              if (bRows?.length) perfil.infoBancaria = bRows[0];

              // busca arquivos
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

  // 3) Atualiza usuário (texto + arquivos)
  updateProfile: async (
    idUsuario,
    { email, telefone, senha, imagemBase64, imagemTipo, documentoBase64, documentoTipo }
  ) => {
    const [[uRow]] = await db.execute(
      "SELECT email FROM usuario WHERE id_usuario = ?",
      [idUsuario]
    );
    const baseUser = (uRow?.email || "").split("@")[0] || `user${idUsuario}`;

    // a) e-mail
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
    // b) telefone
    if (telefone) {
      await db.execute(
        "UPDATE usuario SET telefone = ? WHERE id_usuario = ?",
        [telefone, idUsuario]
      );
    }
    // c) senha
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);
      await db.execute(
        "UPDATE usuario SET senha = ?, salt = ? WHERE id_usuario = ?",
        [hash, salt, idUsuario]
      );
    }
    // d) imagem de perfil
    if (imagemBase64 && imagemTipo) {
      const nomeImg = `perfil_${baseUser}`;
      const [r]    = await db.execute(
        "INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)",
        [nomeImg, imagemTipo, imagemBase64]
      );
      await db.execute(
        "UPDATE usuario SET perfil_arquivo_id = ? WHERE id_usuario = ?",
        [r.insertId, idUsuario]
      );
    }
    // e) documento
    if (documentoBase64 && documentoTipo) {
      const nomeDoc = `documento_perfil_${baseUser}`;
      const [rD]    = await db.execute(
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