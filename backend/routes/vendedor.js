const express = require("express");
const router  = express.Router();
const { autenticarToken } = require("../middlewares/auth.js");
const {getVendedorDetails,updateVendedorProfile} = require("../controllers/vendedor.js");

router.get("/me", autenticarToken, getVendedorDetails); 
router.put("/me", autenticarToken, updateVendedorProfile); 
router.get("/:id", getVendedorDetails); 

module.exports = router;
