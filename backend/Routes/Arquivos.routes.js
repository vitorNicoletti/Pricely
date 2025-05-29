import express from "express";
import {createArquivo,getArquivoById} from "../Controllers/Arquivos.controller.js";

const router = express.Router();
router.post("/", createArquivo);
router.get("/:id", getArquivoById);
export default router;