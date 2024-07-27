import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import GeneralUtils from "../../../utils/generalUtils";
import { Request, Response } from "express";
import { log } from "console";

import paymentsQueries from "../../../sql/paymentsQueries";

const db = new DBConnect();
const generalUtils = new GeneralUtils();

let connection: mysql.PoolConnection | null = null;

export default class PaymentsServices {
  protected async createConn(): Promise<mysql.PoolConnection> {
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
  async createPayment(req: Request, res: Response) {
    const { userID, orderID } = req.params;
    const { amount, paymentMethodID } = req.body;
    const paymentDate = generalUtils.getFullCurrentDate();
    const status = "paid";

    try {
      connection = await this.createConn();

      const payment = await new Promise<mysql.OkPacket>((resolve, reject) => {
        connection?.query(
          paymentsQueries.$insertPaymentSQL,
          [orderID, userID, paymentDate, amount, paymentMethodID, status],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (payment.affectedRows !== 0) {
        return res.json({ message: "Payment created successfully" });
      } else {
        return res.sendStatus(500);
      }
    } catch (error) {
      log(error);
      return res.status(500).json({ message: "Error creating payment" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getPaymentDetails(req: Request, res: Response) {
    const { orderID } = req.params;

    try {
      connection = await this.createConn();
      const paymentDetails = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          paymentsQueries.$getPaymentDetailsSQL,
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

      if (paymentDetails.length === 0) {
        return res
          .status(404)
          .json({ paymentDetails: "Payment Details not found" });
      }
      return res.status(200).json({ paymentDetails: paymentDetails });
    } catch (error) {
      log(error);
      return res
        .status(500)
        .json({ paymentDetails: "Error getting payment details" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async getUserPayments(req: Request, res: Response) {
    const { userID } = req.params;

    try {
      connection = await this.createConn();

      const userPayments = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          paymentsQueries.$getUserPaymentsSQL,
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
      return res.status(200).json({ info: userPayments });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Error getting user payments" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  async updatePaymentStatus(req: Request, res: Response) {
    const { paymentID } = req.params;
    const { status } = req.body;

    try {
      connection = await this.createConn();

      const updatedPayment = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            paymentsQueries.$updatePaymentStatusSQL,
            [status, paymentID],
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
      return res
        .status(200)
        .json({ message: "Payment status updated successfully" });
    } catch (error) {
      log(error);
      return res.status(500).json({ info: "Error updating payment's status" });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}
