const express = require('express');
const router = express.Router();
const {createVendedor} = require('../controllers/cadastro.js')
const {createFornecedor} = require('../controllers/cadastro.js')
// Rota para criar vendedor
router.post("/vendedor", createVendedor);

// Rota para criar fornecedor
router.post("/fornecedor", createFornecedor);
module.exports = router;
