const db = require('../db.js'); 

const Arquivos = {
    getArqPorId: async (id) => {
        const sql = 'SELECT * FROM arquivos WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null); // ou você pode lançar um erro 404
                resolve(results[0]);
            });
        });
    }
}

module.exports = Arquivos;
