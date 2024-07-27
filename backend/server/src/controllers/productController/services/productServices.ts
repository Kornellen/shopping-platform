import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";
import productQueries from "../../../sql/productQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class ProductServices {
  private async createConn(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          log(err);
          reject(err);
        } else if (connection === null) {
          reject("Connection is null");
        } else {
          resolve(connection);
        }
      });
    });
  }

  async addProduct(req: Request, res: Response) {
    const { userID, categoryID, name, desc, price, stockQuantity } = req.body;
    const addedAt = generalUtils.getFullCurrentDate();

    try {
      connection = await this.createConn();
      const product = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          productQueries.$addProductSQL,
          [
            categoryID,
            userID,
            name,
            desc,
            price,
            stockQuantity,
            addedAt,
            addedAt,
          ],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      if (product.affectedRows !== 0) {
        res.json({ info: "Product added successfully" });
      }
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to add product" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getProductsByName(req: Request, res: Response) {
    const { itemName } = req.query;

    const formattedName = `%${itemName}%`;

    try {
      connection = await this.createConn();

      const products = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          productQueries.$getProductsByName,
          [formattedName, formattedName],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      if (products.length === 0) {
        return res.json({ result: [] });
      }
      return res.status(200).json({ result: products });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to get products" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async removeProduct(req: Request, res: Response) {
    const { productID } = req.body;

    try {
      connection = await this.createConn();
      const product = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          productQueries.$removeProduct,
          [productID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });

      if (product.affectedRows !== 0) {
        return res.status(200).json({ info: "Product removed" });
      }
      return res.status(404).json({ error: "Product not found" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to remove product" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getAllProduct(req: Request, res: Response) {
    try {
      connection = await this.createConn();
      const products = await new Promise<any[]>((resolve, reject) => {
        connection?.query(productQueries.$getProducts, (err, result) => {
          if (err) {
            log(err);
            reject(err);
          }
          resolve(result);
        });
      });
      return res.status(200).json({ products: products });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to get products" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async updateProduct(req: Request, res: Response) {
    const { productID } = req.params;
    const { price, description, stockQuantity, name, category } = req.body;

    const updatedAt = generalUtils.getFullCurrentDate();

    if (!productID) {
      return res.status(400).json({ error: "ProductID is required" });
    }

    const update: any[] = [];

    if (price != "" && price != null)
      update.push({ column: "price", value: price });

    if (description != "" && description != null)
      update.push({ column: "description", value: description });

    if (stockQuantity != 0 && stockQuantity != null)
      update.push({ column: "stockQuantity", value: stockQuantity });

    if (name != "" && name != null)
      update.push({ column: "name", value: name });

    if (category != "" && category != null)
      update.push({ column: "categoryID", value: category });

    if (update.length == 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const values = update.map((update) => update.value);

    try {
      connection = await this.createConn();

      const udpatedProduct = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            generalUtils.generateDynamicUpdateQuery("products", update),
            [...values, updatedAt, productID],
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );
      if (udpatedProduct.changedRows !== 0) {
        return res.status(200).json({ info: "Product updated successfully" });
      }
    } catch (error) {
      log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getProductByIDParam(req: Request, res: Response) {
    const { productID } = req.params;

    try {
      connection = await this.createConn();
      const product = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          productQueries.$getProductByIdSQL,
          [productID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result[0]);
          }
        );
      });

      const comments = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          productQueries.$getProductCommentsSQL,
          [productID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });

      if (product && comments) {
        return res
          .status(200)
          .json({ productDatas: product, comments: comments });
      } else {
        return res.status(404).json({ error: "Product not found" });
      }
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
