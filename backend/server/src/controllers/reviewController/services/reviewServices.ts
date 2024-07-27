import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";
import returnsQueries from "../../../sql/returnsQueries";
import reviewsQueries from "../../../sql/reviewsQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class ReviewService {
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
  async addReview(req: Request, res: Response) {
    const { productID } = req.params;
    const { userID, rating, comment } = req.body;
    const createTime = generalUtils.getFullCurrentDate();
    try {
      connection = await this.createConn();
      const review = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          reviewsQueries.$insertReviewSQL,
          [productID, userID, rating, comment, createTime],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      res
        .status(200)
        .json({ info: "Added New Review", reviewID: review.insertId });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to add review" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async removeReview(req: Request, res: Response) {
    const { reviewID } = req.params;
    try {
      connection = await this.createConn();
      const result = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          reviewsQueries.$removeReviewSQL,
          [reviewID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      res.status(200).json({ info: "Successfuly removed" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to remove review" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async updateReview(req: Request, res: Response) {
    const { reviewID } = req.params;
    const { rating, comment } = req.body;
    const updates: any[] = [];
    if (rating !== undefined && rating !== "" && rating != null)
      updates.push({ column: "rating", value: rating });
    if (comment !== undefined && comment !== "" && comment != null)
      updates.push({ column: "comment", value: comment });
    if (updates.length == 0)
      return res.status(400).json({ error: "No fileds to update" });
    const updatedValues = updates.map((update) => update.value);

    try {
      connection = await this.createConn();
      const result = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          generalUtils.generateDynamicUpdateQuery("Reviews", updates),
          [...updatedValues, reviewID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      res.status(200).json({ info: "Successfuly updated" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Failed to update review" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}
