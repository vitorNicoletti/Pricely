const db = require('../db.js');

const Arquivos = {
  /**
   * Salva um arquivo e retorna o insertId.
   */
  salvarArquivo: async (nome, tipo, buffer) => {
    const dadosBase64 = buffer.toString('base64');
    const sql = 'INSERT INTO arquivos (nome, tipo, dados) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(sql, [nome, tipo, dadosBase64]);
    return result.insertId;
  },

  /**
   * Obtém um arquivo pelo ID.
   */
  getArqPorId: async (id) => {
    const sql = 'SELECT id, nome, tipo, dados FROM arquivos WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  /**
   * Deleta um arquivo pelo ID.
   */
  deleteArquivo: async (id) => {
    return db.promise().query('DELETE FROM arquivos WHERE id = ?', [id]);
  }
};

module.exports = Arquivos;
