const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario.model");
const Vendedor = require("../models/vendedor.model");
const Fornecedor = require("../models/fornecedor.model");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { email, senha } = req.body || {};

  if (!validarEmail(email) || !senha) {
    return res.status(400).json({ erro: "E-mail ou senha inválido." });
  }

  // Busca usuário
  let users = await Usuario.getUserByEmail(email);
  if (users.length === 0) {
    return res.status(401).json({ erro: "Usuário não encontrado." });
  }
  const user = users[0];

  // Valida senha
  const senhaCorreta = await bcrypt.compare(senha, user.senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Senha incorreta." });
  }

  // Gera token
  const token = jwt.sign(
    { id_usuario: user.id_usuario, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Busca perfil de vendedor
  let perfil = await Vendedor.getPublicProfile(user.id_usuario)
    .then((vend) => (vend ? { ...vend, role: "vendedor" } : null))
    .catch((_) => null);

  // Se não for vendedor, busca fornecedor
  if (!perfil) {
    perfil = await Fornecedor.getById(user.id_usuario)
      .then((forn) => (forn ? { ...forn, role: "fornecedor" } : null))
      .catch((_) => null);
  }

  // Se encontrou qualquer perfil, injeta o email
  if (perfil) {
    perfil.email = user.email;
  }

  return res.status(200).json({
    message: "Sucesso ao logar.",
    token,
    perfil,
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { login };
