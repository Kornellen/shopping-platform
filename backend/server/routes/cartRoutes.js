const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const CartController = require("../controllers/cartControllers");

const cartControllers = new CartController();

router.post(
  "/cart/:userID/addtocart",
  [
    param("userID").isInt().withMessage("UserID must be integer"),
    body("productID").notEmpty().withMessage("Product is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
  ],
  validateRequest,
  (req, res) => cartControllers.addToCart(req, res)
);

router.get(
  "/cart/:userID/",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req, res) => cartControllers.loadCart(req, res)
);

router.delete(
  "/cart/:userID/deleteFromCart",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("productID").isInt().withMessage("ProductID must be ID"),
  ],
  validateRequest,
  (req, res) => cartControllers.deleteFromCart(req, res)
);

module.exports = router;
