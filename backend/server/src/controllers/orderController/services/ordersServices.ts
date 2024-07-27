import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";

import ordersQueries from "../../../sql/ordersQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

class OrderServices {
  private async createConn(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          log(err);
          reject(err);
        } else if (connection === null) {
          reject("Connection is null");
        } else {
          resolve(connection as mysql.PoolConnection);
        }
      });
    });
  }
  async createOrder(req: Request, res: Response) {
    const { userID } = req.params;
    const { totalAmount, products, shippingMethod } = req.body;

    const currentDate = generalUtils.getOnlyDate();

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();

      if (products.length == 0) {
        return res.status(400).json({ error: "Products are required" });
      }

      const shippingMethodCost = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          ordersQueries.$getCostOfShippingMethod,
          [shippingMethod],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      const totalCost = totalAmount + shippingMethodCost[0].cost;

      const addresses = await new Promise<[]>((resolve, reject) => {
        connection?.query(
          ordersQueries.$getShoppingBillingAddressIDSQL,
          [userID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result.map((address: any) => address?.addressID));
          }
        );
      });
      const orderID = await new Promise<number>((resolve, reject) => {
        connection?.query(
          ordersQueries.$insertOrderSQL,
          [
            userID,
            currentDate,
            totalCost,
            addresses,
            addresses,
            shippingMethod,
          ],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result.insertId);
          }
        );
      });
      const orderItems = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            ordersQueries.dynamicQuery(products, orderID)
              .$insertOrderProductSQL,
            ordersQueries.dynamicQuery(products, orderID).values,
            (err, result) => {
              if (err) {
                log(err);
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );

      if (orderItems.affectedRows !== 0) {
        res.status(200).json({
          info: "Ordered",
          orderID: orderID,
          totalCoast: totalCost,
        });
      }
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Internal server error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getUserOrders(req: Request, res: Response) {
    const { userID } = req.params;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const orders = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          ordersQueries.$getOrdersSQL,
          [userID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });

      if (orders.length === 0) {
        return res.status(200).json({ orders: "You don't have orders" });
      } else {
        return res.status(200).json({ orders: orders });
      }
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Internal server error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getOrderStatus(req: Request, res: Response) {
    const { orderID } = req.params;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const orderStatus = await new Promise<string>((resolve, reject) => {
        connection?.query(
          ordersQueries.$getOrderStatusSQL,
          [orderID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result[0].status);
          }
        );
      });
      return res.status(200).json({ orderStatus: orderStatus });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Internal server error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async cancellOrder(req: Request, res: Response) {
    const { orderID } = req.params;

    try {
      connection = await this.createConn();
      const cancelledOrder = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            ordersQueries.$cancellOrderSQL,
            [orderID],
            (err, result) => {
              if (err) {
                log(err);
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );
      if (cancelledOrder.changedRows !== 0) {
        return res.status(200).json({ info: `Cancelled order: ${orderID}` });
      }
      return res.status(200).json({ info: `Order [${orderID}] Is Cancelled` });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Error Cancelling Order" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default OrderServices;
