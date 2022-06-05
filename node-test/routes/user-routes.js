const express = require("express");
const router = express.Router();
const authController = require("../controllers/user-controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/validate", authController.validateUser);
router.get("/refuse", authController.refuseUser);

module.exports = router;