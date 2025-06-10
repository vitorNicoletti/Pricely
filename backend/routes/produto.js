const express = require("express");
const router = express.Router();
const produtoCtrl = require("../controllers/produto");
const { autenticarToken } = require("../middlewares/auth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }).single("imagem");

// GET /api/produtos → público
router.get("/", produtoCtrl.list);

router.get("/fornecedor/:id", produtoCtrl.listByFornecedor);
router.post("/", autenticarToken, upload, produtoCtrl.create);
router.put("/:id", autenticarToken, upload, produtoCtrl.update);
router.delete("/:id", autenticarToken, produtoCtrl.remove);

module.exports = router;