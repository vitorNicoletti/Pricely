const db = require('../db.js');
const bcrypt = require('bcrypt');

const Usuario = {
    getUserByEmail: async (email) => {
        const sql = 'SELECT * FROM usuario WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results || null); // retorna null se não encontrar
            });
        });
    },

    create: async (email, senha) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        // Agora incluindo dataCadastro = NOW()
        const sql = 'INSERT INTO usuario (email, senha, dataCadastro) VALUES (?, ?, NOW())';
        return new Promise((resolve, reject) => {
            db.query(sql, [email, hashedPassword], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId); // retorna o ID do novo usuário
            });
        });
    }
};

module.exports = Usuario;
