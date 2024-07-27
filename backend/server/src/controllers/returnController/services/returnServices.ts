import mysql, { PoolConnection } from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";
import returnsQueries from "../../../sql/returnsQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class ReutrnServices {
  private async createConn(): Promise<mysql.PoolConnection> {
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

  async getUserRequests(req: Request, res: Response) {
    const { userID } = req.params;

    try {
      connection = await this.createConn();
      const requests = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          returnsQueries.$getUserRequestsSQL,
          [userID],
          (err, results) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(results);
          }
        );
      });
      if (requests.length === 0) {
        return res.status(203).json({ info: "You don't have return request" });
      }
      return res.status(203).json({ info: requests });
    } catch (error) {
    } finally {
    }
  }

  async sendRetrunRequest(req: Request, res: Response) {
    const { orderID, userID } = req.params;
    const { reason } = req.body;
    const createDate = generalUtils.getFullCurrentDate();
    const status = "To check";
    const formattedReson = generalUtils.capitalizeFirstLetter(reason);

    try {
      connection = await this.createConn();
      const requestID = await new Promise<number>((resolve, reject) => {
        connection?.query(
          returnsQueries.$addRequestToDBSQL,
          [orderID, userID, formattedReson, status, createDate, createDate],
          (err, result: mysql.OkPacket) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result.insertId);
          }
        );
      });
      const emails = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          returnsQueries.$searchUserEmail,
          [orderID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      emails.forEach((email) =>
        generalUtils.sendEmails(email.email, requestID)
      );

      res.status(200).json({ info: "Request Sent Successfully" });
    } catch (error) {
      log(error);
      res.status(500).json({ info: "Error Sending Request" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getRequestDetails(req: Request, res: Response) {
    const { requestID } = req.params;

    try {
      connection = await this.createConn();
      const requestDetails = await new Promise<any>((resolve, reject) => {
        connection?.query(
          returnsQueries.$getReturnRequestDetails,
          [requestID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result[0]);
          }
        );
      });
      res.status(200).json({ result: requestDetails });
    } catch (error) {
      log(error);
      res.status(500).json({ result: "Error Getting Request Details" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async updateReturnRequest(req: Request, res: Response) {
    const { requestID } = req.params;
    const { status, reason } = req.body;
    const updatedAt = generalUtils.getFullCurrentDate();
    const updates: any[] = [];
    if (status != null && status != "" && status != undefined)
      updates.push({ column: "status", value: status });
    if (reason != null && reason != "" && reason != undefined)
      updates.push({ column: "reason", value: reason });
    const value = updates.map((value) => value.value);

    try {
      connection = await this.createConn();
      const updateReturnRequest = await new Promise<any>((resolve, reject) => {
        connection?.query(
          returnsQueries.$updateRequestStatus,
          [...value, updatedAt, requestID],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            }
            resolve(result);
          }
        );
      });
      res.status(200).json({ info: "Successfully Updated" });
    } catch (error) {
      log(error);
      res.status(500).json({ result: "Error Updating Request" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async deleteReturnRequest(req: Request, res: Response) {
    const { requestID } = req.params;

    try {
      connection = await this.createConn();
      const deleteReturnRequest = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            returnsQueries.$removeReturnRequest,
            [requestID],
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
      res.status(200).json({ info: "Successfully removed" });
    } catch (error) {
      log(error);
      res.status(500).json({ result: "Error removing request" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}
