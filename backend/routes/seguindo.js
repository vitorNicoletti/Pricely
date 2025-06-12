const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/seguindo");
const { autenticarToken } = require("../middlewares/auth");

router.use(autenticarToken);      

router.get   ("/:id", ctrl.status);   
router.post  ("/:id", ctrl.seguir);   
router.delete("/:id", ctrl.unfollow); 

module.exports = router;