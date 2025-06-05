const express = require("express");
const router = express.Router();

const {
  getAllVendedores,
  getVendedorDetails
} = require("../controllers/vendedor.js");

router.get("/", getAllVendedores);

router.get("/:id", getVendedorDetails);

module.exports = router;
