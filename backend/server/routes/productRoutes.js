const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
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

router.get("/getallproducts", (req, res) =>
  productController.getAllProduct(req, res)
);

router.get(
  "/product/:productID",
  param("productID").isInt().withMessage("Param ProductID must be Integer"),
  validateRequest,
  (req, res) => productController.getProductByIDParam(req, res)
);

router.patch(
  "/product/:productID",
  [
    param("productID").isInt().withMessage("Param ProductID must be Integer"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("Price must be decimal number"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be text"),
    body("stockQuantity")
      .optional()
      .isInt()
      .withMessage("Stock Qunatity must be Integer"),
    body("name").optional().isString().withMessage("Name must be text"),
    body("category")
      .optional()
      .isInt()
      .withMessage("Category ID is required not Category Name"),
  ],
  validateRequest,
  (req, res) => productController.updateProduct(req, res)
);

module.exports = router;
