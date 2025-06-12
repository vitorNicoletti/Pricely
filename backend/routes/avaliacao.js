const express = require('express');
const router = express.Router();
const {avaliarProduto} = require('../controllers/avaliacao.js');
const { autenticarToken } = require('../middlewares/auth.js');
// Suas rotas aqui
router.post('/produto',autenticarToken, avaliarProduto);
module.exports = router;
