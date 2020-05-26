const express = require("express");
const router = express.Router();

const userController = require("./users.controller");

router.post("/signup", userController.postSignup);

router.post("/login", userController.postLogin);

module.exports = router;
