const express = require('express');
const router = express.Router();
const {getAllProducts,getProductDetails} = require('../controllers/catalogo.js')
// Suas rotas aqui
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);
module.exports = router;
