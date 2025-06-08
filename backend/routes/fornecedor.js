const express = require("express");
const multer = require("multer");
const { autenticarToken } = require("../middlewares/auth.js");
const {getFornecedorDetails,updateFornecedorProfile} = require("../controllers/fornecedor.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/fornecedor/me  → entra aqui e usa o id do token
router.get("/me", autenticarToken, getFornecedorDetails);

// PUT /api/fornecedor/me  → seu updateProfile
router.put("/me",autenticarToken,upload.fields([{ name: "imagemPerfil",  maxCount: 1 },{ name: "documentoPerfil", maxCount: 1 }]),updateFornecedorProfile);

// GET /api/fornecedor/:id  → perfil público
router.get("/:id", getFornecedorDetails);

module.exports = router;