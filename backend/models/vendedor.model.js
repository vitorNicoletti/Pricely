const db = require("../db.js");
const Arquivos = require("./arquivos.model.js");
const Usuario = require("./usuario.model.js");

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
   * @param {(err: Error|null, perfil: object|null) => void} callback
   */
  getById: async (idUsuario, callback) => {
    try {
      const [results] = await db.promise().query(
        `
      SELECT 
        u.id_usuario,
        u.email,
        u.dataCadastro,
        u.telefone,
        u.perfil_arquivo_id,
        u.documento_arquivo_id,
        v.cpfCnpj
      FROM usuario AS u
      INNER JOIN vendedor AS v ON u.id_usuario = v.id_usuario
      WHERE u.id_usuario = ?
    `,
        [idUsuario]
      );

      if (!results || results.length === 0) return callback(null, null);

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

      const [carteiraRows] = await db.promise().query(
        `
      SELECT id_carteira, saldo, ultima_atualizacao 
        FROM carteira 
       WHERE id_usuario = ?
    `,
        [idUsuario]
      );

      if (carteiraRows.length > 0) {
        perfil.carteira = carteiraRows[0];
      }

      const [bancoRows] = await db.promise().query(
        `
      SELECT id_info_banco, banco, agencia, conta, tipo_conta, pix 
        FROM info_bancaria 
       WHERE id_user = ?
    `,
        [idUsuario]
      );

      if (bancoRows.length > 0) {
        perfil.infoBancaria = bancoRows[0];
      }

      // Carrega arquivos, se existirem
      if (perfil.perfil_arquivo_id) {
        perfil.imagemPerfil = await Arquivos.getArqPorId(
          perfil.perfil_arquivo_id
        );
      }

      if (perfil.documento_arquivo_id) {
        perfil.documentoPerfil = await Arquivos.getArqPorId(
          perfil.documento_arquivo_id
        );
      }

      return callback(null, perfil);
    } catch (error) {
      return callback(error);
    }
  },
};

module.exports = Vendedor;
