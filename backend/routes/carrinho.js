const express = require("express");
const router = express.Router();

const {getCarrinho, adicionarAoCarrinho} = require("../controllers/carrinho.js")
const {autenticarToken} = require('../middlewares/auth')
// Rota que pega o carrinho do vendedor logado:
router.get('/',autenticarToken,getCarrinho)
router.post('/',autenticarToken,adicionarAoCarrinho)
module.exports = router