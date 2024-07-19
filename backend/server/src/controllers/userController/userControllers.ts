import mysql from "mysql";
import DBConnect from "../../utils/dbConnect";
import SecurityUtils from "../../utils/securityUtils";
import GeneralUtils from "../../utils/generalUtils";
import { Request, Response } from "express";

import { log } from "console";
import userQueries from "../../sql/userQueries";
import UserServices from "./services/userServices";

const db = new DBConnect();
const security = new SecurityUtils();
const generalUtils = new GeneralUtils();

class UserController {
  private userServices: UserServices;

  constructor() {
    this.userServices = new UserServices();
  }

  async createUser(req: Request, res: Response) {
    try {
      this.userServices.createUser(req, res);
    } catch (error: any) {
      log(error);
      return res.status(500).send(error.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      this.userServices.login(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async addAddresses(req: Request, res: Response) {
    try {
      this.userServices.addAddresses(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async updateUserDatas(req: Request, res: Response) {
    try {
      this.userServices.updateUserDatas(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async updateUserAddress(req: Request, res: Response) {
    try {
      this.userServices.updateUserAddress(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  async updateUsername(req: Request, res: Response) {
    try {
      this.userServices.updateUsername(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  changePassword(req: Request, res: Response) {
    try {
      this.userServices.changePassword(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  getUserDatas(req: Request, res: Response) {
    try {
      this.userServices.getUserDatas(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  getUserAddresses(req: Request, res: Response) {
    try {
      this.userServices.getUserAddresses(req, res);
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    }
  }

  getAllUsers(req: Request, res: Response) {
    this.userServices.getAllUsers(req, res);
  }
}

export default UserController;
