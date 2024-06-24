const express = require("express");

const router = express.Router();
const { body } = require("express-validator");

const UserController = require("../controllers/userControllers");
const validateRequest = require("../middleware/validator");

const user = new UserController();

router.post(
  "/createuser",
  [
    body("username").notEmpty().withMessage("Username is Required"),
    body("email").isEmail().withMessage("Email isn't valid"),
    body("password").notEmpty().withMessage("Password is Required"),
    body("firstName").notEmpty().withMessage("First Name is Required"),
    body("lastName").notEmpty().withMessage("Last Name is Required"),
    body("phoneNumber").isMobilePhone().withMessage("Phone is Required"),
    body("dob").isDate().withMessage("Bithdate is Required"),
  ],
  validateRequest,
  (req, res) => user.createUser(req, res)
);
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  (req, res) => user.login(req, res)
);
router.post(
  "/addaddress",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("addressLine").notEmpty().withMessage("Address Line is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("postalCode").notEmpty().withMessage("Postal Code is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  validateRequest,
  (req, res) => user.addAddresses(req, res)
);
router.patch(
  "/updateusername",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("newUsername").notEmpty().withMessage("New Username is Required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  (req, res) => user.updateUsername(req, res)
);
router.patch(
  "/changePassword",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("password").notEmpty().withMessage("Current password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ],
  validateRequest,
  (req, res) => user.changePassword(req, res)
);

module.exports = router;
