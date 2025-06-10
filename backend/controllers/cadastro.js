const Usuario = require("../models/usuario.model");
const Vendedor = require("../models/vendedor.model");
const Fornecedor = require("../models/fornecedor.model");

/**
 * POST /api/cadastro/vendedor
 * Cria um novo vendedor (usuário + registro em tabela vendedor)
 */
async function createVendedor(req, res) {
  const { email, senha, cpfCnpj } = req.body || {};

  // Valida presença dos campos
  if (!email || !senha || !cpfCnpj) {
    return res
      .status(400)
      .json({ erro: "Necessario os campos email senha e cpfCnpj" });
  }

  // Validação de CPF ou CNPJ
  if (!validarCPF(cpfCnpj) && !validarCNPJ(cpfCnpj)) {
    return res.status(400).json({ erro: "CPF/CNPJ invalido" });
  }

  // Validação de e-mail
  if (!validarEmail(email)) {
    return res.status(400).json({ erro: "email invalido" });
  }

  // Verifica se já existe usuário com este e-mail
  const usuarios = await Usuario.getUserByEmail(email);
  if (usuarios && usuarios.length >= 1) {
    return res.status(400).json({ erro: "ja existe uma conta com esse email" });
  }

  // Cria usuário e obtém o ID gerado
  let usuarioId;
  try {
    usuarioId = await Vendedor.createVendedor(email, senha, cpfCnpj, telefone); // ✅ telefone passado
  } catch (err) {
    console.error("Erro ao criar vendedor:", err);
    return res
      .status(500)
      .json({ erro: "Erro ao tentar se comunicar com o banco, tente novamente mais tarde" });
  }

  // Retorna mensagem de sucesso
  return res.status(200).json({ mensagem: "Vendedor adicionado com sucesso" });
}

/**
 * POST /api/cadastro/fornecedor
 * Cria um novo fornecedor (usuário + registro em tabela fornecedor)
 */
async function createFornecedor(req, res) {
  const {
    email,
    senha,
    razaoSocial,
    nomeFantasia,
    cnpj,
    inscricaoEstadual,
    inscricaoMunicipal,
    logradouro,
    numero,
    complemento,
    repNome,
    repCpf,
    repTelefone,
  } = req.body || {};

  // Validações básicas de campos obrigatórios
  if (
    !email ||
    !senha ||
    !razaoSocial ||
    !nomeFantasia ||
    !cnpj ||
    !logradouro ||
    !numero ||
    !repNome ||
    !repCpf ||
    !repTelefone
  ) {
    return res
      .status(400)
      .json({ erro: "Faltam campos obrigatórios para fornecedor" });
  }

  // Validação de CNPJ
  if (!validarCNPJ(cnpj)) {
    return res.status(400).json({ erro: "CNPJ inválido" });
  }

  // Validação de e-mail
  if (!validarEmail(email)) {
    return res.status(400).json({ erro: "E-mail inválido" });
  }

  // Verifica se já existe usuário com este e-mail
  const usuarios = await Usuario.getUserByEmail(email);
  if (usuarios && usuarios.length >= 1) {
    return res.status(400).json({ erro: "Já existe uma conta com esse email" });
  }

  // 1) Cria usuário e obtém ID
  let usuarioId;
  try {
    usuarioId = await Usuario.create(email, senha);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return res.status(500).json({ erro: "Erro ao criar usuário" });
  }

  // 2) Insere dados na tabela fornecedor
  try {
    await Fornecedor.createFornecedor({
      idUsuario: usuarioId,
      razaoSocial,
      nomeFantasia,
      cnpj,
      inscricaoEstadual,
      inscricaoMunicipal,
      logradouro,
      numero,
      complemento,
      repNome,
      repCpf,
      repTelefone,
    });
    return res.status(200).json({ mensagem: "Fornecedor adicionado com sucesso" });
  } catch (err) {
    console.error("Erro ao cadastrar fornecedor:", err);
    return res.status(500).json({ erro: "Erro ao cadastrar fornecedor" });
  }
}

// validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  return true;
}

// validar CNPJ
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calcularDigito = (base, pesos) => {
    const soma = base.reduce((acc, num, i) => acc + num * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const base = cnpj.substring(0, 12).split("").map(Number);
  const digitosOriginais = cnpj.substring(12).split("").map(Number);
  const digito1 = calcularDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcularDigito([...base, digito1], [
    6,
    5,
    4,
    3,
    2,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
  ]);
  return digitosOriginais[0] === digito1 && digitosOriginais[1] === digito2;
}

// validação de e-mail em cadastro e login
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { createVendedor, createFornecedor };