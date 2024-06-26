const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const paymentControllers = require("../controllers/paymentsController");

const paymentController = new paymentControllers();

router.post(
  "/user/:userID/order/:orderID/pay",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
    body("amount").isInt().withMessage("Amount must be an Integer"),
    body("paymentMethodID")
      .isInt()
      .withMessage("PaymentMethodID must be an Integer"),
  ],
  validateRequest,
  (req, res) => paymentController.createPayment(req, res)
);

router.get(
  "/user/:userID/order/:orderID/paymentdetails",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
  ],
  validateRequest,
  (req, res) => paymentController.getPaymentDetails(req, res)
);

router.get(
  "/user/:userID/payments",
  [param("userID").isInt().withMessage("UserID must be an Integer")],
  validateRequest,
  (req, res) => paymentController.getUserPayments(req, res)
);

router.patch(
  "/user/:userID/order/:orderID/payment/:paymentID/statusupdate",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
    param("paymentID").isInt().withMessage("PaymentID must be an Integer"),
    body("status").isString().withMessage("Status must be a String"),
  ],
  validateRequest,
  (req, res) => paymentController.updatePaymentStatus(req, res)
);

module.exports = router;
