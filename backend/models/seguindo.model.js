const db = require("../db");

// Todas as funções retornam (err, result)
const Seguindo = {
  seguir(seguidorId, seguidoId, cb) {
    const sql = `
      INSERT IGNORE INTO seguindo
        (id_usuario_seguidor, id_usuario_seguido, dataCadastro)
      VALUES (?, ?, NOW())
    `;
    db.query(sql, [seguidorId, seguidoId], cb);
  },

  deixarDeSeguir(seguidorId, seguidoId, cb) {
    db.query(
      "DELETE FROM seguindo WHERE id_usuario_seguidor = ? AND id_usuario_seguido = ?",
      [seguidorId, seguidoId],
      cb
    );
  },

  estaSeguindo(seguidorId, seguidoId, cb) {
    db.query(
      "SELECT 1 FROM seguindo WHERE id_usuario_seguidor = ? AND id_usuario_seguido = ? LIMIT 1",
      [seguidorId, seguidoId],
      (err, rows) => cb(err, !!rows?.length)
    );
  },

  totalSeguidores(seguidoId, cb) {
    db.query(
      "SELECT COUNT(*) AS total FROM seguindo WHERE id_usuario_seguido = ?",
      [seguidoId],
      (err, rows) => cb(err, rows?.[0]?.total ?? 0)
    );
  },
};

module.exports = Seguindo;