import { Response, Request } from "express";
import ReviewService from "./services/reviewServices";
import { log } from "console";

export default class Review {
  private reviewServices: ReviewService;
  constructor() {
    this.reviewServices = new ReviewService();
  }
  addReview(req: Request, res: Response) {
    try {
      this.reviewServices.addReview(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  removeReview(req: Request, res: Response) {
    try {
      this.reviewServices.removeReview(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
  updateReview(req: Request, res: Response) {
    try {
      this.reviewServices.updateReview(req, res);
    } catch (error) {
      log(error);
      res.sendStatus(500);
    }
  }
}
