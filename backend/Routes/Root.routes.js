import express from "express";
import { getRoot } from "../Controllers/Root.controller.js";
import arquivosRoutes from "./arquivos.routes.js";

const router = express.Router();

// Rota Raiz
router.get("/", getRoot);
// Rotas de arquivos (Img, PDF, etc.)
router.use("/arquivos", arquivosRoutes);

export default router;