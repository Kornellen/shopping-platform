const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/returnsQueries");

const log = console.log;

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class Return {
  //Creating Connection with Database
  async createConn(callback, res) {
    db.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connection);
    });
  }

  //Geting All User's Return Requests
  getUserRequests(req, res) {
    const { userID } = req.params;

    this.createConn((connect) => {
      connect.query(queries.$getUserRequestsSQL, [userID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        res.status(200).json({ requests: result });
      });
    });
  }

  //Adding User's Return Request
  sendRetrunRequest(req, res) {
    const { orderID, userID } = req.params;
    const { reason } = req.body;

    const createDate = generalUtils.getFullCurrentDate();

    const status = "To check";

    const formattedReson = generalUtils.capitalizeFirstLetter(reason);

    this.createConn((connect) => {
      connect.query(
        queries.$addRequestToDBSQL,
        [orderID, userID, formattedReson, status, createDate, createDate],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }
          res.status(200).json({ info: "Request Sent Successfully" });
        }
      );
    });
  }

  //Updating User's request (For Seller and User)
  updateReturnRequest(req, res) {
    const { requestID } = req.params;
    const { status, reason } = req.body;

    const updatedAt = generalUtils.getFullCurrentDate();

    const updates = [];

    if (status != null && status != "" && status != undefined)
      updates.push({ column: "status", value: status });

    if (reason != null && reason != "" && reason != undefined)
      updates.push({ column: "reason", value: reason });

    const value = updates.map((value) => value.value);

    this.createConn((connect) => {
      connect.query(
        generalUtils.generateDynamicUpdateQuery("returnsrequests", update),
        [value, updatedAt, requestID],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          res.status(200).json({ info: "Successfully Updated" });
        }
      );
    });
  }

  //Deleting Return Request From DB
  deleteReturnRequest(req, res) {
    const { requestID } = req.params;

    this.createConn((connect) => {
      connect.query(
        queries.$removeReturnRequest,
        [requestID],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          return res.status(200).json({ info: "Successfully removed" });
        }
      );
    });
  }
}

module.exports = Return;
