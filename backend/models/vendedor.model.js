const db = require('../db')
const Usuario = require('./usuario.model')

const Vendedor = {
    createVendedor: async (email, senha, cpfCnpj) => {
        // 1. Cria o usuário (supondo que Usuario.create retorna o ID)
        const usuarioId = await Usuario.create(email, senha)
        // 2. Insere o vendedor na tabela vendedores
        const result = await db.execute(
            'INSERT INTO vendedor (id_usuario, cpfCnpj) VALUES (?, ?)',
            [usuarioId, cpfCnpj]
        )
        // 3. Retorna o ID do novo vendedor
        //TODO: tentar entender o pq ele n retornar nada no result
        return usuarioId
    }
}

module.exports = Vendedor
