import express from "express";

const router = express.Router();
const Controller = require('../Controllers/Controller');

router.get('/', Controller.getRoot);

export default router;