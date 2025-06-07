const db = require('../db');
const Usuario = require('./usuario.model');

const Vendedor = {
  // Criação de vendedor com base em usuário
  createVendedor: async (email, senha, cpfCnpj) => {
    // 1. Cria o usuário
    const usuarioId = await Usuario.create(email, senha);

    // 2. Insere o vendedor
    const result = await db.execute(
      'INSERT INTO vendedor (id_usuario, cpfCnpj) VALUES (?, ?)',
      [usuarioId, cpfCnpj]
    );

    // 3. Retorna o ID do novo usuário (vendedor)
    return usuarioId;
  },
  // TODO: Consertar funcoes a baixo, elas não seguem as regras de negócio.
  // Funcao de buscar todos nao deveria existir, e buscar por id especifico, pode até existir
  // mas so para o caso que uma pagina de outro usuario for acessada, não para o caso de pegar
  // informações pessoais do cliente, além disso, quando for fazer direito uma funcao que pegue o usuario logado,
  // tem que pegar mais informacoes, como por exemplo o saldo da carteira, a imagem de perfil, etc. 
  // ou seja, as 2 funcoes abaixo nasceram velhas.
  
  // Buscar todos os vendedores

}
module.exports = Vendedor
