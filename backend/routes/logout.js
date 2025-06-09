const express = require("express");
const router = express.Router();
const {autenticarToken} = require("../middlewares/auth");
const {logout} = require("../controllers/logout");

router.post("/", autenticarToken, logout);

module.exports = router;
