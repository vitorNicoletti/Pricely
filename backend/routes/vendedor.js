const express = require("express");
const router = express.Router();


const {autenticarToken} = require('../middlewares/auth')
const { getVendedorDetails } = require("../controllers/vendedor.js");

// Rota para o perfil do vendedor logado:
router.get("/me", autenticarToken, getVendedorDetails);

// Rota  para buscar perfil de qualquer vendedor por ID:
router.get("/:id", getVendedorDetails);

module.exports = router;