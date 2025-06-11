const express = require("express");

const multer = require("multer");
const {getCarrinho,get} = require("../controllers/carrinho")
const { autenticarToken } = require("../middlewares/auth.js");
const {getVendedorDetails,updateVendedorProfile} = require("../controllers/vendedor.js");
const {getPedidos} = require("../controllers/pedido.js")
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });



router.get("/pedidos",autenticarToken,getPedidos)
// Rota que pega o carrinho do vendedor logado:
router.get('/carrinho',autenticarToken,getCarrinho)

// GET perfil próprio
router.get("/me", autenticarToken, getVendedorDetails);

// PUT atualização de perfil (texto + uploads)
router.put("/me",autenticarToken,upload.fields([{ name: "imagemPerfil",  maxCount: 1 },{ name: "documentoPerfil", maxCount: 1 }]),updateVendedorProfile);

// GET perfil público por ID
router.get("/:id", getVendedorDetails);

module.exports = router;
