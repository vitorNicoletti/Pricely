const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model')
const jwt = require('jsonwebtoken');


async function createVendedor(req,res){
    const {email,password, cpf} = req || {undefined,undefined,undefined} 
    if(!email || !password || !cpf){
        return res.status(400).json({ erro: 'Necessario os campos email senha e cpf' });
    }

    if(!validarCPF(cpf)){
        return res.status(400).json({erro: 'CPF invalido'})
    }
    if(!validarEmail(email)){
        return res.status(400).json({erro: 'email invalido'})
    }
    //podemos adicionar futuramente checagem de senha fraca, mas sem crise
    

}
async function login(req,res){
    const {email, password} = (req.body || {undefined})

    // Verificação básica de e-mail com regex
    
    if (!emailValido) {
        return res.status(400).json({ erro: 'E-mail inválido' });
    }
    const user = await Usuario.getUserByEmail(email)

    if (!user){
        return res.status(401).json({erro: "Usuario não encontrado"})
    }
    const senhaCorreta = await bcrypt.compare(password, user.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' });
    }
    else{
        return gerarToken({id_usuario: user.id_usuario, email: user.email})
    }

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
