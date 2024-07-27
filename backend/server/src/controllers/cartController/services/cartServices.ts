import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";

import cartQueries from "../../../sql/cartQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class CartServices {
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

  async addToCart(req: Request, res: Response) {
    const { userID } = req.params;
    const { productID, quantity } = req.body;
    const currentTime = generalUtils.getFullCurrentDate();

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const cartResult = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            cartQueries.$addToCartSQL,
            [userID, productID, quantity, currentTime],
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
      if (cartResult.affectedRows === 0) {
        return res.status(400).json({ info: "Product not added to cart" });
      }

      return res.status(200).json({ info: "Product added to cart" });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Internal server error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async loadCart(req: Request, res: Response) {
    const { userID } = req.params;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const cartResult = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          cartQueries.$loadUserCartSQL,
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
      const cartID = cartResult[0]?.cartID;

      const cartItems = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          cartQueries.$loadCartItemNameSQL,
          [cartID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });

      res.status(200).json({ cartItems: cartItems });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Internal server error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateProductQuantity(req: Request, res: Response) {
    const { userID, productID } = req.params;
    const { quantity } = req.body;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const cartResult = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          cartQueries.$loadUserCartSQL,
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
      const cartID = +cartResult[0]?.cartID;
      const updatedCartItem = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            cartQueries.$updateProductQunatitySQL,
            [quantity, cartID, productID],
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
      if (updatedCartItem.affectedRows === 0) {
        return res.status(401).json({ error: "Bad Datas" });
      }
      return res.status(200).json({ info: "Successfully updated quantity" });
    } catch (error) {
      log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async deleteFromCart(req: Request, res: Response) {
    const { userID } = req.params;
    const { productID } = req.body;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const cartResult = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          cartQueries.$getUserCartIDSQL,
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
      if (cartResult.length === 0) {
        return res.status(401).json({ error: "Cart not found" });
      }
      const cartFinalResult = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            cartQueries.$deleteFromCartSQL,
            [+cartResult[0].cartID, productID],
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

      if (cartFinalResult.affectedRows === 0) {
        return res.status(401).json({ error: "Bad Datas" });
      }
      return res.status(200).json({ info: "Successfully removed" });
    } catch (error) {
      log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default CartServices;
