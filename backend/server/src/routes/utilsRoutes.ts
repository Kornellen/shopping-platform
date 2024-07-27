import { Router, Request, Response } from "express";
import UtilsController from "../controllers/utilController/utilsControllers";

const utilsController = new UtilsController();
const utilsRouter = Router();

utilsRouter.get("/categories", (req: Request, res: Response) =>
  utilsController.getCategories(req, res)
);

utilsRouter.get("/shipping-methods", (req: Request, res: Response) =>
  utilsController.getShippingMethods(req, res)
);

utilsRouter.get("/payment-methods", (req: Request, res: Response) =>
  utilsController.getPaymentMethods(req, res)
);

export default utilsRouter;
