const express = require("express");
const router = express.Router();

const { getFornecedorDetails } = require("../controllers/fornecedor.js");

router.get("/:id", getFornecedorDetails);

module.exports = router;
