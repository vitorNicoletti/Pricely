const express = require("express");
const router = express.Router();
const { getVendedorProfile } = require("../controllers/vendedor.js");

const { autenticarToken } = require("../middlewares/auth.js");

router.get("/me", autenticarToken, getVendedorProfile);

module.exports = router;