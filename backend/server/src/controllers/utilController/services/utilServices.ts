import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import utilsQueries from "../../../sql/utilsQueries";
import { log } from "console";
import { Request, Response } from "express";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class UtilsServices {
  constructor() {}
  private async createConn(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          log(err);
          reject(err);
        }
        resolve(connection as mysql.PoolConnection);
      });
    });
  }
  async getCategories(req: Request, res: Response) {
    try {
      connection = await this.createConn();

      const categories = await new Promise<any[]>((resolve, reject) => {
        connection?.query(utilsQueries.$getAllCategories, (err, result) => {
          if (err) {
            log(err);
            reject(err);
          }
          resolve(result);
        });
      });

      return res.status(200).json({ categories: categories });
    } catch (error) {
      log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getShippingMethods(req: Request, res: Response) {
    try {
      connection = await this.createConn();
      const shippingMethods = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          utilsQueries.$getAllShippingMethods,
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      return res.status(200).json({ methods: shippingMethods });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getPaymentMethods(req: Request, res: Response) {
    try {
      connection = await this.createConn();
      const paymentMethods = await new Promise<any[]>((resolve, reject) => {
        connection?.query(utilsQueries.$getAllPaymentMethods, (err, result) => {
          if (err) {
            log(err);
            reject(err);
          }
          resolve(result);
        });
      });
      return res.status(200).json({ methods: paymentMethods });
    } catch (error) {
    } finally {
    }
  }
}
