const express = require("express");
const router = express.Router();
const produtoCtrl = require("../controllers/produto");
const { autenticarToken } = require("../middlewares/auth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }).single("imagem");

// GET /api/produtos        → público
router.get("/", produtoCtrl.list);

// POST /api/produtos       → criação (autenticado + upload)
router.post("/", autenticarToken, upload, produtoCtrl.create);

// PUT /api/produtos/:id    → atualização (autenticado + upload)
router.put("/:id", autenticarToken, upload, produtoCtrl.update);

// DELETE /api/produtos/:id → exclusão (autenticado)
router.delete("/:id", autenticarToken, produtoCtrl.remove);

module.exports = router;