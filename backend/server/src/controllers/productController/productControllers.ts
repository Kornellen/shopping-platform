import { Request, Response } from "express";
import ProductServices from "./services/productServices";
import { log } from "console";

export default class Product {
  private productServices: ProductServices;

  constructor() {
    this.productServices = new ProductServices();
  }

  addProduct(req: Request, res: Response) {
    try {
      this.productServices.addProduct(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  getProductsByName(req: Request, res: Response) {
    try {
      this.productServices.getProductsByName(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  removeProduct(req: Request, res: Response) {
    try {
      this.productServices.removeProduct(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  updateProduct(req: Request, res: Response) {
    try {
      this.productServices.updateProduct(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  getProductByIDParam(req: Request, res: Response) {
    try {
      this.productServices.getProductByIDParam(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  getAllProducts(req: Request, res: Response) {
    try {
      this.productServices.getAllProduct(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
