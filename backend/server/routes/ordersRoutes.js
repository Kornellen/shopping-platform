const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const OrderControllers = require("../controllers/ordersController");

const orderController = new OrderControllers();

router.post(
  "/user/:userID/order/create",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("totalAmount").isDecimal().withMessage("Total Amount must be Decimal"),
    body("products")
      .isArray()
      .withMessage("Products must be an Array with Products"),
  ],
  validateRequest,
  (req, res) => orderController.createOrder(req, res)
);

router.get(
  "/user/:userID/order/orders",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req, res) => orderController.getUserOrders(req, res)
);

router.get(
  "/user/:userID/order/orderstatus/:orderID",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    param("orderID").isInt().withMessage("OrderID must be Integer"),
  ],
  validateRequest,
  (req, res) => orderController.getOrderStatus(req, res)
);

module.exports = router;
