import { Router, Response, Request } from "express";
import { body, param, query } from "express-validator";
import validateRequest from "../middleware/validator";
import Return from "../controllers/returnController/retrurnController";
import { join } from "path";

const returnRouter = Router();

const returnController = new Return();

returnRouter.post(
  "/user/:userID/order/:orderID/requestreturn",
  [
    param("userID").isInt().withMessage("UserID must be an integer"),
    param("orderID").isInt().withMessage("OrderID must be an integer"),
    body("reason").isString().withMessage("Reason must be a String"),
  ],
  validateRequest,
  (req: Request, res: Response) => returnController.sendRetrunRequest(req, res)
);

returnRouter.patch(
  "/returnsrequests/:requestID/update",
  [
    param("requestID").isInt().withMessage("RequestID must be an Integer"),
    body("status").optional().isString().withMessage("Status must be a String"),
    body("reason").optional().isString().withMessage("Reason must be a String"),
  ],
  validateRequest,
  (req: Request, res: Response) =>
    returnController.updateReturnRequest(req, res)
);

returnRouter.delete(
  "/user/:userID/returnsrequests/:requestID/delete",
  [
    param("userID").isInt().withMessage("UserID Must be an Integer"),
    param("requestID").isInt().withMessage("RequestID must be an Integer"),
  ],
  validateRequest,
  (req: Request, res: Response) =>
    returnController.deleteReturnRequest(req, res)
);

returnRouter.get(
  "/returnrequests/:requestID",
  [param("requestID").isInt().withMessage("RequestID must be an Integer")],
  validateRequest,
  (req: Request, res: Response) => returnController.getRequestDetails(req, res)
);

returnRouter.get(
  "/updateRequestStatus.html/update",
  [query("requestID").isInt().withMessage("RequestID must be an Integer")],
  validateRequest,
  (req: Request, res: Response) =>
    res.sendFile(join(__dirname, "../public/updateRequestStatus.html"))
);

returnRouter.get(
  "/user/:userID/returnrequests",
  [param("userID").isInt().withMessage("UserID must be an Integer")],
  validateRequest,
  (req: Request, res: Response) => returnController.getUserRequests(req, res)
);
export default returnRouter;
