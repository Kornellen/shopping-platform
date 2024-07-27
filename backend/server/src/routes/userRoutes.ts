import { Router, Request, Response } from "express";

import { body, query } from "express-validator";

import UserController from "../controllers/userController/userControllers";

import validateRequest from "../middleware/validator";

const user = new UserController();

const userRouter = Router();

userRouter.post(
  "/createuser",
  [
    body("username").notEmpty().withMessage("Username is Required"),
    body("email").isEmail().withMessage("Email isn't valid"),
    body("password").notEmpty().withMessage("Password is Required"),
    body("firstName").notEmpty().withMessage("First Name is Required"),
    body("lastName").notEmpty().withMessage("Last Name is Required"),
    body("phoneNumber").isMobilePhone("pl-PL").withMessage("Phone is Required"),
    body("dob").isDate().withMessage("Bithdate is Required"),
  ],
  validateRequest,
  (req: Request, res: Response) => user.createUser(req, res)
);
userRouter.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => user.login(req, res)
);
userRouter.post(
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
  (req: Request, res: Response) => user.addAddresses(req, res)
);

userRouter.patch(
  "/updateuserdatas",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("email").isEmail().optional(),
    body("phone").optional(),
  ],
  validateRequest,
  (req: Request, res: Response) => user.updateUserDatas(req, res)
);
userRouter.patch(
  "/updateaddresses",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("addressLine").optional(),
    body("city").optional(),
    body("state").optional(),
    body("postalCode").optional(),
    body("country").optional(),
  ],
  validateRequest,
  (req: Request, res: Response) => user.updateUserAddress(req, res)
);

userRouter.patch(
  "/updateusername",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("newUsername").notEmpty().withMessage("New Username is Required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => user.updateUsername(req, res)
);
userRouter.patch(
  "/changePassword",
  [
    body("userID").isInt().withMessage("UserID must be an integer"),
    body("password").notEmpty().withMessage("Current password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => user.changePassword(req, res)
);

userRouter.get("/userData", [
  query("userID").isString().withMessage("UserID must be an Integer"),
  validateRequest,
  (req: Request, res: Response) => user.getUserDatas(req, res),
]);

userRouter.get(
  "/addresses",
  query("userID").isString().isInt().withMessage("UserID isn't valid"),
  validateRequest,
  (req: Request, res: Response) => user.getUserAddresses(req, res)
);

userRouter.get("/users", (req: Request, res: Response) =>
  user.getAllUsers(req, res)
);

export default userRouter;
