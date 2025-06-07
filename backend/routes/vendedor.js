const express = require("express");
const router = express.Router();

const {getCarrinho} = require("../controllers/pedido")
const {autenticarToken} = require('../middlewares/auth')
router.get('/carrinho',autenticarToken,getCarrinho)
module.exports = router;
