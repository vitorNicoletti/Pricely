
const Usuario = require("../models/usuario.model");
const Vendedor = require("../models/vendedor.model");

async function createVendedor(req,res){
    const {email,senha, cpfCnpj} = req.body || {undefined,undefined,undefined} 
    console.log(req.body)

    if(!email || !senha || !cpfCnpj){
        return res.status(400).json({ erro: 'Necessario os campos email senha e cpfCnpj' });
    }

    if(!validarCPF(cpfCnpj)){
        if (!validarCNPJ(cpfCnpj)){
            return res.status(400).json({erro: 'CPF/CNPJ invalido'})
        }

    }

    if(!validarEmail(email)){
        
        return res.status(400).json({erro: 'email invalido'})
    }
    else{
        
        usuarios = await Usuario.getUserByEmail(email)
        if (usuarios){
            if(usuarios.length>1){return res.status(400).json({erro: 'ja existe uma conta com esse email'})}
        }

    }

    //podemos adicionar futuramente checagem de senha fraca, mas sem crise
    
    const idInsert = await Vendedor.createVendedor(email,senha,cpfCnpj);
    if(!idInsert){
        return res.status(500).json({ erro: 'Erro ao tentar se comunicar com o banco, tente novamente mais tarde' });
    }
    return res.status(200).json({ erro: 'Vendedor adicionado com sucesso' });
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

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos com todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const calcularDigito = (base, pesos) => {
        const soma = base.reduce((acc, num, i) => acc + num * pesos[i], 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const base = cnpj.substring(0, 12).split('').map(Number);
    const digitosOriginais = cnpj.substring(12).split('').map(Number);

    const digito1 = calcularDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const digito2 = calcularDigito([...base, digito1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return digitosOriginais[0] === digito1 && digitosOriginais[1] === digito2;
}


module.exports = {createVendedor}