const db = require("../db.js");
const Arquivos = require("./arquivos.model.js");
const Usuario = require("./usuario.model.js");
const bcrypt = require("bcrypt");

const Vendedor = {
  /**
   * Criação de vendedor com base em usuário
   * @returns {Promise<number>} → ID do usuário recém-criado
   */
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

  /**
   * Retorna o perfil completo do vendedor (usuário+vendedor+carteira+info_bancaria+arquivos)
   * @param {number} idUsuario
   * @returns {Promise<object|null>}
   */
  getById: async (idUsuario) => {
    try {
      const [results] = await db.promise().query(
        `SELECT 
          u.id_usuario,
          u.email,
          u.dataCadastro,
          u.telefone,
          u.perfil_arquivo_id,
          u.documento_arquivo_id,
          v.cpfCnpj
        FROM usuario AS u
        INNER JOIN vendedor AS v ON u.id_usuario = v.id_usuario
        WHERE u.id_usuario = ?`,
        [idUsuario]
      );

      if (!results || results.length === 0) return null;

      const row = results[0];
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
        infoBancaria: null,
      };

      // Busca dados da carteira
      const [carteiraRows] = await db.promise().query(
        `SELECT id_carteira, saldo, ultima_atualizacao 
         FROM carteira 
         WHERE id_usuario = ?`,
        [idUsuario]
      );

      if (carteiraRows.length > 0) {
        perfil.carteira = carteiraRows[0];
      }

      // Busca dados bancários
      const [bancoRows] = await db.promise().query(
        `SELECT id_info_banco, banco, agencia, conta, tipo_conta, pix 
         FROM info_bancaria 
         WHERE id_user = ?`,
        [idUsuario]
      );

      if (bancoRows.length > 0) {
        perfil.infoBancaria = bancoRows[0];
      }

      // Carrega imagem de perfil, se existir
      if (perfil.perfil_arquivo_id) {
        perfil.imagemPerfil = await Arquivos.getArqPorId(
          perfil.perfil_arquivo_id
        );
      }

      // Carrega documento, se existir
      if (perfil.documento_arquivo_id) {
        perfil.documentoPerfil = await Arquivos.getArqPorId(
          perfil.documento_arquivo_id
        );
      }

      return perfil;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retorna o perfil público do vendedor (email, imagemPerfil)
   * @param {number} idUsuario
   * @returns {Promise<object|null>}
   */
  getPublicProfile: async (idUsuario) => {
    try {
      const [results] = await db.promise().query(
        `SELECT 
          u.id_usuario,
          u.email,
          u.perfil_arquivo_id
        FROM usuario AS u
        INNER JOIN vendedor AS v ON u.id_usuario = v.id_usuario
        WHERE u.id_usuario = ?`,
        [idUsuario]
      );

      if (!results || results.length === 0) return null;

      const row = results[0];
      const perfil = {
        id_usuario: row.id_usuario,
        email: row.email,
        perfil_arquivo_id: row.perfil_arquivo_id,
        imagemPerfil: null,
      };

      if (perfil.perfil_arquivo_id) {
        perfil.imagemPerfil = await Arquivos.getArqPorId(
          perfil.perfil_arquivo_id
        );
      }

      return perfil;
    } catch (error) {
      throw error;
    }
  },

  // 4) Atualiza usuário (texto + arquivos)
  updateProfile: async (
    idUsuario,
    {
      email,
      telefone,
      senha,
      imagemBase64,
      imagemTipo,
      documentoBase64,
      documentoTipo,
    }
  ) => {
    // Busca usuário base e hash da senha
    const [[uRow]] = await db
      .promise()
      .query("SELECT email, senha FROM usuario WHERE id_usuario = ?", [
        idUsuario,
      ]);
    const baseUser = (uRow?.email || "").split("@")[0] || `user${idUsuario}`;

    // Verifica se a senha enviada está correta
    if (!senha) {
      throw new Error("Senha obrigatória para atualizar perfil");
    }
    const senhaCorreta = await bcrypt.compare(senha, uRow.senha);
    if (!senhaCorreta) {
      throw new Error("Senha incorreta");
    }

    // a) e-mail
    if (email) {
      const [dup] = await db
        .promise()
        .query("SELECT 1 FROM usuario WHERE email = ? AND id_usuario <> ?", [
          email,
          idUsuario,
        ]);
      if (dup.length > 0) throw new Error("Email já utilizado");
      await db
        .promise()
        .query("UPDATE usuario SET email = ? WHERE id_usuario = ?", [
          email,
          idUsuario,
        ]);
    }
    // b) telefone
    if (telefone) {
      await db
        .promise()
        .query("UPDATE usuario SET telefone = ? WHERE id_usuario = ?", [
          telefone,
          idUsuario,
        ]);
    }
    // d) imagem de perfil
    if (imagemBase64 && imagemTipo) {
      const nomeImg = `perfil_${baseUser}`;
      const [r] = await db
        .promise()
        .query("INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)", [
          nomeImg,
          imagemTipo,
          imagemBase64,
        ]);
      await db
        .promise()
        .query(
          "UPDATE usuario SET perfil_arquivo_id = ? WHERE id_usuario = ?",
          [r.insertId, idUsuario]
        );
    }
    // e) documento
    if (documentoBase64 && documentoTipo) {
      const nomeDoc = `documento_perfil_${baseUser}`;
      const [rD] = await db
        .promise()
        .query("INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)", [
          nomeDoc,
          documentoTipo,
          documentoBase64,
        ]);
      await db
        .promise()
        .query(
          "UPDATE usuario SET documento_arquivo_id = ? WHERE id_usuario = ?",
          [rD.insertId, idUsuario]
        );
    }
  },
};

module.exports = Vendedor;
