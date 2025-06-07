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
  getById: (idUsuario, callback) => {
    // 1) SELECT usuario + vendedor
    const sqlUsuarioVendedor = `
      SELECT 
        u.id_usuario,
        u.email,
        u.dataCadastro,
        u.telefone,
        u.perfil_arquivo_id,
        u.documento_arquivo_id,
        v.cpfCnpj
      FROM usuario AS u
      INNER JOIN vendedor AS v
        ON u.id_usuario = v.id_usuario
      WHERE u.id_usuario = ?
    `;
    db.query(sqlUsuarioVendedor, [idUsuario], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) {
        // não existe registro em "vendedor" para esse usuário
        return callback(null, null);
      }
      const row = results[0];
      const perfil = {
        id_usuario:         row.id_usuario,
        email:              row.email,
        dataCadastro:       row.dataCadastro,
        telefone:           row.telefone,
        perfil_arquivo_id:    row.perfil_arquivo_id,
        documento_arquivo_id: row.documento_arquivo_id,
        cpfCnpj:            row.cpfCnpj,
        imagemPerfil:       null,
        documentoPerfil:    null,
        carteira:           null,
        infoBancaria:       null
      };

      // 2) Buscar dados da carteira
      const sqlCarteira = `
        SELECT id_carteira, saldo, ultima_atualizacao 
          FROM carteira 
         WHERE id_usuario = ?
      `;
      db.query(sqlCarteira, [idUsuario], (err2, rowsCarteira) => {
        if (err2) return callback(err2);
        if (rowsCarteira && rowsCarteira.length > 0) {
          perfil.carteira = rowsCarteira[0];
        }

        // 3) Buscar dados bancários
        const sqlBancaria = `
          SELECT id_info_banco, banco, agencia, conta, tipo_conta, pix 
            FROM info_bancaria 
           WHERE id_user = ?
        `;
        db.query(sqlBancaria, [idUsuario], (err3, rowsBancaria) => {
          if (err3) return callback(err3);
          if (rowsBancaria && rowsBancaria.length > 0) {
            perfil.infoBancaria = rowsBancaria[0];
          }

          // 4) Se existir perfil_arquivo_id → buscar imagem de perfil
          if (perfil.perfil_arquivo_id) {
            Arquivos.getArqPorId(perfil.perfil_arquivo_id, (err4, arquivo) => {
              if (!err4 && arquivo) {
                perfil.imagemPerfil = arquivo;
              }
              // 5) Agora, se existir documento_arquivo_id → buscar documento
              if (perfil.documento_arquivo_id) {
                Arquivos.getArqPorId(perfil.documento_arquivo_id, (err5, docArq) => {
                  if (!err5 && docArq) {
                    perfil.documentoPerfil = docArq;
                  }
                  return callback(null, perfil);
                });
              } else {
                return callback(null, perfil);
              }
            });
          } else {
            // 6) Caso não tenha perfil_arquivo_id, mas tenha documento_arquivo_id
            if (perfil.documento_arquivo_id) {
              Arquivos.getArqPorId(perfil.documento_arquivo_id, (err6, docArq2) => {
                if (!err6 && docArq2) {
                  perfil.documentoPerfil = docArq2;
                }
                return callback(null, perfil);
              });
            } else {
              return callback(null, perfil);
            }
          }
        });
      });
    });
  }
};

module.exports = Vendedor;
