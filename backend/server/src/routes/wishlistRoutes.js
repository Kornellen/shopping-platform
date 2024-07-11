const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validator");

const WishlistController = require("../controllers/wishlistControllers");

const wishlistController = new WishlistController();

router.post(
  "/wishlist/:userID/items/addTo",
  [
    param("userID").isInt().withMessage("UserID must be Integer"),
    body("productID").isInt().withMessage("ProductID must be Integer"),
  ],
  validateRequest,
  (req, res) => wishlistController.addToWishlist(req, res)
);

router.get(
  "/wishlist/:userID/items",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req, res) => wishlistController.getWishlist(req, res)
);

router.delete(
  "/wishlist/:userID/items/delete",
  [param("userID").isInt().withMessage("UserID must be Integer")],
  validateRequest,
  (req, res) => wishlistController.removeFromWishlist(req, res)
);

module.exports = router;
