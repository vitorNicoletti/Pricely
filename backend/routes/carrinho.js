const express = require("express");
const router = express.Router();

const {
  getCarrinho,
  adicionarAoCarrinho,
  finalizarCompra,
  removerProduto
} = require("../controllers/carrinho.js");

const { autenticarToken } = require('../middlewares/auth');

// Middleware global: será aplicado a todas as rotas abaixo
router.use(autenticarToken);

router.post('/', adicionarAoCarrinho);
router.post('/finalizar', finalizarCompra);
router.delete('/', removerProduto);

module.exports = router;
