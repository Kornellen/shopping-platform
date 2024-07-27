import { Response, Request } from "express";
import UtilsServices from "./services/utilServices";
import { log } from "console";

export default class UtilsController {
  private utilsServices: UtilsServices;

  constructor() {
    this.utilsServices = new UtilsServices();
  }
  getCategories(req: Request, res: Response) {
    try {
      this.utilsServices.getCategories(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  getShippingMethods(req: Request, res: Response) {
    try {
      this.utilsServices.getShippingMethods(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  getPaymentMethods(req: Request, res: Response) {
    try {
      this.utilsServices.getPaymentMethods(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
