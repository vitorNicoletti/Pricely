const db = require('../db.js'); 

const Produto_Oferta = {
    getOfertaByProduct: (id,callback) => {

        const sql = 'SELECT id_oferta FROM produto_oferta WHERE id_produto = ?';
        db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null); // ou erro 404, se preferir
        callback(null, results[0]);
    });
    }
}

module.exports = Produto_Oferta;