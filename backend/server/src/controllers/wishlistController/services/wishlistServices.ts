import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import wishlistQueries from "../../../sql/wishlistQueries";
import { log } from "console";
import { Request, Response } from "express";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class WishlistServices {
  private createConn(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else if (connection === null) {
          reject("Connection is null");
        } else {
          resolve(connection);
        }
      });
    });
  }
  async addToWishlist(req: Request, res: Response) {
    const { userID } = req.params;
    const { productID } = req.body;

    try {
      connection = await this.createConn();
      const wishlistID = await new Promise<string>((resolve, reject) => {
        connection?.query(
          wishlistQueries.$findUserWishlistSQL,
          [userID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result[0].wishlistID);
          }
        );
      });

      const addTowishlist = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            wishlistQueries.$addToWishlistSQL,
            [wishlistID, productID],
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
      res.status(200).json({ info: "Successfully added to wishlist" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Error adding to wishlist" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getWishlist(req: Request, res: Response) {
    const { userID } = req.params;

    try {
      connection = await this.createConn();
      const wishlistItems = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          wishlistQueries.$getWishlistItemsByUserID,
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
      if (wishlistItems.length === 0) {
        return res.status(204).json({ info: "Your Wishlist seems empty" });
      }
      res.status(200).json({ wishlistItems: wishlistItems });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Error getting wishlist" });
    } finally {
      if (connection) {
        connection.release();
      }
    }

    // this.getConn((connect) => {
    //   connect.query(
    //     queries.$getWishlistItemsByUserID,
    //     [userID],
    //     (err, result) => {
    //       if (err) {
    //         connect.release();
    //         log(err);
    //         return res.sendStatus(500);
    //       }

    //       if (result.length === 0) {
    //         connect.release();
    //         return res.status(204).json({ info: "Your Wishlist seems empty" });
    //       }

    //       const wishlistID = result[0].wishlistID;

    //       connect.query(
    //         queries.$getWishlistItemsSQL,
    //         [wishlistID],
    //         (err, result) => {
    //           connect.release();
    //           if (err) {
    //             log(err);
    //             return res.sendStatus(500);
    //           }

    //           return res.status(200).json({ wishlistItems: result });
    //         }
    //       );
    //     }
    //   );
    // });
  }
  async removeFromWishlist(req: Request, res: Response) {
    const { userID } = req.params;
    const { productID } = req.body;

    try {
      const connection = await this.createConn();
      const removeFromWishlist = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection.query(
            wishlistQueries.$removeFromWishlistSQL,
            [userID, productID],
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
      res.status(200).json({ info: "Removed Successfully" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Error removing from wishlist" });
    } finally {
      if (connection) {
        connection.release();
      }
    }

    // this.getConn((connect) => {
    //   connect.query(queries.$getWishlistItemsIDSQL, [userID], (err, result) => {
    //     if (err) {
    //       connect.release();
    //       log(err);
    //       return res.sendStatus(500);
    //     }
    //     if (result.length === 0) {
    //       connect.release();
    //       return res.status(404).json({ error: "Item Not Found" });
    //     }

    //     const wishlistID = result[0].wishlistID;
    //     connect.query(
    //       queries.$removeFromWishlistSQL,
    //       [wishlistID, productID],
    //       (err, result) => {
    //         connect.release();
    //         if (err) {
    //           log(err);
    //           return res.sendStatus(500);
    //         }
    //         res.status(200).json({ info: "Removed Successfully" });
    //       }
    //     );
    //   });
    // });
  }
}
