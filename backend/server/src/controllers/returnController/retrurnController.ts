import { log } from "console";
import ReutrnServices from "./services/returnServices";
import { Response, Request } from "express";

export default class Return {
  private returnServices: ReutrnServices;

  constructor() {
    this.returnServices = new ReutrnServices();
  }

  getUserRequests(req: Request, res: Response) {
    try {
      this.returnServices.getUserRequests(req, res);
    } catch (error) {
      res.sendStatus(500);
    }
  }
  sendRetrunRequest(req: Request, res: Response) {
    try {
      this.returnServices.sendRetrunRequest(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  getRequestDetails(req: Request, res: Response) {
    try {
      this.returnServices.getRequestDetails(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  updateReturnRequest(req: Request, res: Response) {
    try {
      this.returnServices.updateReturnRequest(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  deleteReturnRequest(req: Request, res: Response) {
    try {
      this.returnServices.deleteReturnRequest(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
