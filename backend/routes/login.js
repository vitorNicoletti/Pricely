const express = require('express');
const router = express.Router();
const {login} = require('../controllers/login.js')
// Suas rotas aqui
router.post('/', login);
module.exports = router;
