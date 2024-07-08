const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const ReviewController = require("../controllers/reviewsController");

const reviewControllers = new ReviewController();

router.post(
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
  (req, res) => reviewControllers.addReview(req, res)
);

router.delete(
  "/review/:reviewID",
  [param("reviewID").isInt().withMessage("ReviewID must be an Integer")],
  validateRequest,
  (req, res) => reviewControllers.removeReview(req, res)
);

router.patch(
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
  (req, res) => reviewControllers.updateReview(req, res)
);

module.exports = router;
