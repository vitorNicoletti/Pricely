const express = require('express');
const router = express.Router();
const {createVendedor} = require('../controllers/cadastro.js')
// Suas rotas aqui
router.post('/vendedor', createVendedor);
module.exports = router;
