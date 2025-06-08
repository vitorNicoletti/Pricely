const express = require("express");
const multer = require("multer");
const { autenticarToken } = require("../middlewares/auth.js");
const {getFornecedorDetails,updateFornecedorProfile} = require("../controllers/fornecedor.js");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// PUT atualização de perfil (texto + uploads)
router.put("/me",autenticarToken,upload.fields([{ name: "imagemPerfil",  maxCount: 1 },{ name: "documentoPerfil", maxCount: 1 }]),updateFornecedorProfile);

// GET perfil público por ID
router.get("/:id", getFornecedorDetails);

module.exports = router;
