import { Router, Response, Request } from "express";
import validateRequest from "../middleware/validator";
import { body, param } from "express-validator";

import OrderController from "../controllers/orderController/ordersController";

const orderRouter = Router();

const orderController = new OrderController();

orderRouter.post(
  "/user/:userID/order/create",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("totalAmount").isDecimal().withMessage("Total Amount must be Decimal"),
    body("products")
      .isArray()
      .withMessage("Products must be an Array with Products"),
  ],
  validateRequest,
  (req: Request, res: Response) => orderController.createOrder(req, res)
);

orderRouter.get(
  "/user/:userID/order/orders/",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req: Request, res: Response) => orderController.getUserOrders(req, res)
);

orderRouter.get(
  "/user/:userID/order/orderstatus/:orderID",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    param("orderID").isInt().withMessage("OrderID must be Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) => orderController.getOrderStatus(req, res)
);

orderRouter.get(
  "/user/:userID/order/orderstatus/:orderID/cancel",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    param("orderID").isInt().withMessage("OrderID must be Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) => orderController.cancellOrder(req, res)
);

export default orderRouter;
