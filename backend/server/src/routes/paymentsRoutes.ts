import validateRequest from "../middleware/validator";
import { body, param } from "express-validator";
import { Router, Request, Response } from "express";
import Payments from "../controllers/paymentController/paymentsController";

const paymentRouter = Router();
const paymentController = new Payments();

paymentRouter.post(
  "/user/:userID/order/:orderID/pay",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
    body("amount").isDecimal().withMessage("Amount must be an Integer"),
    body("paymentMethodID")
      .isInt()
      .withMessage("PaymentMethodID must be an Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) => paymentController.createPayment(req, res)
);

paymentRouter.get(
  "/user/:userID/order/:orderID/paymentdetails",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) => paymentController.getPaymentDetails(req, res)
);

paymentRouter.get(
  "/user/:userID/payments",
  [param("userID").isInt().withMessage("UserID must be an Integer")],
  validateRequest,
  (req: Request, res: Response) => paymentController.getUserPayments(req, res)
);

paymentRouter.patch(
  "/user/:userID/order/:orderID/payment/:paymentID/statusupdate",
  [
    param("userID").isInt().withMessage("UserID must be an Integer"),
    param("orderID").isInt().withMessage("OrderID must be an Integer"),
    param("paymentID").isInt().withMessage("PaymentID must be an Integer"),
    body("status").isString().withMessage("Status must be a String"),
  ],
  validateRequest,
  (req: Request, res: Response) =>
    paymentController.updatePaymentStatus(req, res)
);

export default paymentRouter;
