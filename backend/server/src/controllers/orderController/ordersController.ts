import { Request, Response } from "express";
import { log } from "console";

import OrderServices from "./services/ordersServices";

export default class OrderController {
  private orderServices: OrderServices;

  constructor() {
    this.orderServices = new OrderServices();
  }
  async createOrder(req: Request, res: Response) {
    try {
      this.orderServices.createOrder(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }
  async getUserOrders(req: Request, res: Response) {
    try {
      this.orderServices.getUserOrders(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }
  async getOrderStatus(req: Request, res: Response) {
    try {
      this.orderServices.getOrderStatus(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }
  async cancellOrder(req: Request, res: Response) {
    try {
      this.orderServices.cancellOrder(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }
}
