import { Request, Response } from "express";
import WishlistServices from "./services/wishlistServices";
import { log } from "console";

export default class Wishlist {
  private wishlistService: WishlistServices;

  constructor() {
    this.wishlistService = new WishlistServices();
  }

  addToWishlist(req: Request, res: Response) {
    try {
      this.wishlistService.addToWishlist(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  getWishlist(req: Request, res: Response) {
    try {
      this.wishlistService.getWishlist(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }

  removeFromWishlist(req: Request, res: Response) {
    try {
      this.wishlistService.removeFromWishlist(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
