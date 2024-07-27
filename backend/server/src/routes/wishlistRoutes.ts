import { Router, Request, Response } from "express";
import { body, param } from "express-validator";
import validateRequest from "../middleware/validator";
import Wishlist from "../controllers/wishlistController/wishlistControllers";

const wishlistController = new Wishlist();
const wishlistRouter = Router();

wishlistRouter.post(
  "/wishlist/:userID/items/addTo",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("productID").isInt().withMessage("ProductID must be Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) => wishlistController.addToWishlist(req, res)
);

wishlistRouter.get(
  "/wishlist/:userID/items",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req: Request, res: Response) => wishlistController.getWishlist(req, res)
);

wishlistRouter.delete(
  "/wishlist/:userID/items/delete",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req: Request, res: Response) =>
    wishlistController.removeFromWishlist(req, res)
);

export default wishlistRouter;
