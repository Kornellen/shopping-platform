import { Request, Response } from "express";
import { log } from "console";

import CartServices from "./services/cartServices";

class CartController {
  private cartServices: CartServices;

  constructor() {
    this.cartServices = new CartServices();
  }

  async addToCart(req: Request, res: Response) {
    try {
      this.cartServices.addToCart(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async loadCart(req: Request, res: Response) {
    try {
      this.cartServices.loadCart(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async updateProductQuantity(req: Request, res: Response) {
    try {
      this.cartServices.updateProductQuantity(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async deleteFromCart(req: Request, res: Response) {
    try {
      this.cartServices.deleteFromCart(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }
}

export default CartController;
