const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/paymentsQueries");

const log = console.log;

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class Payments {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  createPayment(req, res) {
    const { userID, orderID } = req.params;
    const { amount, paymentMethodID } = req.body;

    const paymentDate = generalUtils.getFullCurrentDate();

    const status = "paid";

    this.getConn((connect) => {
      connect.query(
        queries.$insertPaymentSQL,
        [orderID, userID, paymentDate, amount, paymentMethodID, status],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            res.sendStatus(500);
          }

          res.status(200).json({ info: "Success" });
        }
      );
    });
  }

  getPaymentDetails(req, res) {
    const { orderID } = req.params;

    this.getConn((connect) => {
      connect.query(queries.$getPaymentDetailsSQL, [orderID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        return res.status(200).json({ paymentDetails: result });
      });
    });
  }

  getUserPayments(req, res) {
    const { userID } = req.params;

    this.getConn((connect) => {
      connect.query(queries.$getUserPaymentsSQL, [userID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        return res.status(200).json({ info: result });
      });
    });
  }

  updatePaymentStatus(req, res) {
    const { paymentID } = req.params;
    const { status } = req.body;

    this.getConn((connect) => {
      connect.query(
        queries.$updatePaymentStatusSQL,
        [status, paymentID],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }
          return res.status(200).json({ info: "Success " });
        }
      );
    });
  }
}

module.exports = Payments;
