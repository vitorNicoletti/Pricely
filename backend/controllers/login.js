const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model')
const jwt = require('jsonwebtoken');


async function login(req,res){
    const {email, senha} = (req.body || {undefined,undefined})
    // Verificação básica de e-mail com regex
    
    if (!validarEmail(email) || !senha) {
        return res.status(400).json({ erro: 'E-mail ou senha inválido' });
    }
    let user = await Usuario.getUserByEmail(email)
    
    if (user.length === 0){
        return res.status(401).json({erro: "Usuario não encontrado"})
    }
    user = user[0]
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' });
    }
    // em vez de { user: { … } }, faça:
    
    const token = gerarToken({ id_usuario: user.id_usuario, email: user.email });

    return res.status(200).json({message:"Sucesso ao logar",token:token})

}

function gerarToken(payload) {
    const secret = process.env.JWT_SECRET; // guarde no .env em produção
    const options = {
        expiresIn: '1h', // expira em 1 hora
    };

    const token = jwt.sign(payload, secret, options);
    return token;
}
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se tem 11 dígitos ou se é uma sequência inválida
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


module.exports = {login}
