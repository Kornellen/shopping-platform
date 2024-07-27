import { Request, Response } from "express";

import PaymentsServices from "./services/paymentsServices";
import { log } from "console";

export default class Payments {
  private paymentsServices: PaymentsServices;

  constructor() {
    this.paymentsServices = new PaymentsServices();
  }

  createPayment(req: Request, res: Response) {
    try {
      this.paymentsServices.createPayment(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  getPaymentDetails(req: Request, res: Response) {
    try {
      this.paymentsServices.getPaymentDetails(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  getUserPayments(req: Request, res: Response) {
    try {
      this.paymentsServices.getUserPayments(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  updatePaymentStatus(req: Request, res: Response) {
    try {
      this.paymentsServices.updatePaymentStatus(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
