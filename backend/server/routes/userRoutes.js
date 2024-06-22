const express = require("express");

const router = express.Router();

const UserController = require("../controllers/userControllers");

const user = new UserController();

router.post("/createuser", (req, res) => user.createUser(req, res));
router.post("/login", (req, res) => user.login(req, res));

module.exports = router;
