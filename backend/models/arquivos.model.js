const db = require('../db.js'); 

const Arquivos = {
    getArqPorId: (id,callback) => {
        const sql = 'SELECT * FROM arquivos WHERE id = ?';
        db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null); // ou erro 404, se preferir
        callback(null, results[0]);
    });
    }

}

module.exports = Arquivos