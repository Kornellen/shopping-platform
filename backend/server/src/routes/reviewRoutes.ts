import { Router, Response, Request } from "express";
import validateRequest from "../middleware/validator";
import { body, param } from "express-validator";
import Review from "../controllers/reviewController/reviewsController";

const reviewController = new Review();

const reviewRouter = Router();

reviewRouter.post(
  "/product/:productID/addcomment",
  [
    param("productID").isInt().withMessage("ProductID must be an Integer"),
    body("userID").isInt().withMessage("UserID must be an Integer"),
    body("rating").isDecimal().withMessage("Rating must be a Decimal"),
    body("comment")
      .isString()
      .optional()
      .withMessage("Comment must be a String"),
  ],
  validateRequest,
  (req: Request, res: Response) => reviewController.addReview(req, res)
);

reviewRouter.delete(
  "/review/:reviewID",
  [param("reviewID").isInt().withMessage("ReviewID must be an Integer")],
  validateRequest,
  (req: Request, res: Response) => reviewController.removeReview(req, res)
);

reviewRouter.patch(
  "/review/:reviewID/updateReview",
  [
    param("reviewID").isInt().withMessage("ReviewID myst be an Integer"),
    body("rating")
      .optional()
      .isDecimal()
      .withMessage("Rating must be a Decimal"),
    body("comment").optional().isString().withMessage("Comment must be a Text"),
  ],
  validateRequest,
  (req: Request, res: Response) => reviewController.updateReview(req, res)
);
export default reviewRouter;
