const utilsQueries = require("../sql/utilsQueries");
const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class UtilsController {
  async createConn(callback, res) {
    db.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connection);
    });
  }

  getCategories(req, res) {
    this.createConn((connect) => {
      connect.query(utilsQueries.$getAllCategories, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "No categories found" });
        }

        return res.status(200).json({ categories: result });
      });
    });
  }

  getShippingMethods(req, res) {
    this.createConn((connect) => {
      connect.query(utilsQueries.$getAllShippingMethods, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        return res.status(200).json({ methods: result });
      });
    });
  }

  getPaymentMethods(req, res) {
    this.createConn((connect) => {
      connect.query(utilsQueries.$getAllPaymentMethods, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        return res.status(200).json({ methods: result });
      });
    });
  }
}

module.exports = UtilsController;
