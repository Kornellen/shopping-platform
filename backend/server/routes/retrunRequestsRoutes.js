const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const returnsControllers = require("../controllers/retrurnsController");

const returnsController = new returnsControllers();

router.post(
  "/user/:userID/order/:orderID/requestreturn",
  [
    param("userID").isInt().withMessage("UserID must be an integer"),
    param("orderID").isInt().withMessage("OrderID must be an integer"),
    body("reason").isString().withMessage("Reason must be a String"),
  ],
  validateRequest,
  (req, res) => returnsController.sendRetrunRequest(req, res)
);

router.patch(
  "/user/:userID/returnsrequests/:requestID/update",
  [
    param("userID").isInt().withMessage("UserID Must be an Integer"),
    param("requestID").isInt().withMessage("RequestID must be an Integer"),
    body("status").optional().isString().withMessage("Status must be a String"),
    body("reason").optional().isString().withMessage("Reason must be a String"),
  ],
  validateRequest,
  (req, res) => returnsController.updateReturnRequest(req, res)
);

router.delete(
  "/user/:userID/returnsrequests/:requestID/delete",
  [
    param("userID").isInt().withMessage("UserID Must be an Integer"),
    param("requestID").isInt().withMessage("RequestID must be an Integer"),
  ],
  validateRequest,
  (req, res) => returnsController.deleteReturnRequest(req, res)
);

router.get(
  "/user/:userID/returnrequests",
  [param("userID").isInt().withMessage("UserID must be an Integer")],
  validateRequest,
  (req, res) => returnsController.getUserRequests(req, res)
);

module.exports = router;
