const express = require("express");
const UtilsController = require("../controllers/utilsControllers");
const router = express.Router();

const utilsControllers = new UtilsController();

router.get("/categories", (req, res) =>
  utilsControllers.getCategories(req, res)
);

module.exports = router;
