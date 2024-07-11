const express = require("express");
const UtilsController = require("../controllers/utilsControllers");
const router = express.Router();

const utilsControllers = new UtilsController();

router.get("/categories", (req, res) =>
  utilsControllers.getCategories(req, res)
);

router.get("/shipping-methods", (req, res) =>
  utilsControllers.getShippingMethods(req, res)
);

router.get("/payment-methods", (req, res) =>
  utilsControllers.getPaymentMethods(req, res)
);

module.exports = router;
