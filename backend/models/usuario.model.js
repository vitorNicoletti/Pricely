const db = require('../db.js');

const Usuario = {
    getUserByEmail: async (email) => {
        const sql = 'SELECT * FROM usuario WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0] || null); // retorna null se não encontrar
            });
        });
    },
};

module.exports = Usuario;
