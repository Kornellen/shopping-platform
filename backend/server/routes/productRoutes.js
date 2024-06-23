const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middleware/validator");

const ProductControllers = require("../controllers/productControllers");

const productController = new ProductControllers();

router.post(
  "/addproduct",
  [
    body("categoryID").isInt().withMessage("CategoryID must be integer"),
    body("name").notEmpty().withMessage("Name is required"),
    body("desc").notEmpty().withMessage("Description is required"),
    body("price").isDecimal().withMessage("Price must be decimal number"),
    body("stockQuantity").notEmpty().withMessage("Stock Qunatity is required"),
  ],
  validateRequest,
  (req, res) => productController.addProduct(req, res)
);

module.exports = router;
