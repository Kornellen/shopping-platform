import { Router, Request, Response } from "express";
import { body, param } from "express-validator";
import validateRequest from "../middleware/validator";
import CartController from "../controllers/cartController/cartControllers";

const cartControllers = new CartController();

const cartRouter = Router();

cartRouter.post(
  "/cart/:userID/addtocart",
  [
    param("userID").isInt().withMessage("UserID must be integer"),
    body("productID").notEmpty().withMessage("Product is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => cartControllers.addToCart(req, res)
);

cartRouter.get(
  "/cart/:userID/",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req: Request, res: Response) => cartControllers.loadCart(req, res)
);

cartRouter.patch(
  "/cart/:userID/product/:productID/updateQuantity",
  [
    param("userID").notEmpty().withMessage("UserID is required"),
    param("productID").notEmpty().withMessage("ProductID is required"),
  ],
  validateRequest,
  (req: Request, res: Response) =>
    cartControllers.updateProductQuantity(req, res)
);

cartRouter.delete(
  "/cart/:userID/deleteFromCart",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("productID").isInt().withMessage("ProductID must be ID"),
  ],
  validateRequest,
  (req: Request, res: Response) => cartControllers.deleteFromCart(req, res)
);

export default cartRouter;
