const express = require("express");
const router  = express.Router();
const { autenticarToken } = require("../middlewares/auth.js");
const {getFornecedorDetails,updateFornecedorProfile} = require("../controllers/fornecedor.js");

router.put("/me", autenticarToken, updateFornecedorProfile); // update próprio
router.get("/:id", getFornecedorDetails); // perfil público

module.exports = router;
