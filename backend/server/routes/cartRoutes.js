const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middleware/validator");

const CartController = require("../controllers/cartControllers");

const cartControllers = new CartController();

router.post(
  "/addtocart",
  [
    body("userID").isInt().withMessage("UserID must be integer"),
    body("productID").notEmpty().withMessage("Product is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
  ],
  validateRequest,
  (req, res) => cartControllers.addToCart(req, res)
);

module.exports = router;
