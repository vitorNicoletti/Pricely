const express = require("express");
const router = express.Router();

const {getCarrinho, adicionarAoCarrinho,finalizarCompra} = require("../controllers/carrinho.js")
const {autenticarToken} = require('../middlewares/auth')
// Rota que pega o carrinho do vendedor logado:
router.get('/',autenticarToken,getCarrinho)
router.post('/',autenticarToken,adicionarAoCarrinho)
router.post('/finalizar',autenticarToken,finalizarCompra)
module.exports = router