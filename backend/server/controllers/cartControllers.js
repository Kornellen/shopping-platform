const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/cartQueries");

const log = console.log;

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class CartController {
  async createConn(callback, res) {
    db.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connection);
    });
  }

  addToCart(req, res) {
    const { userID } = req.params;
    const { productID, quantity } = req.body;

    const currentTime = generalUtils.getFullCurrentDate();

    this.createConn((connect) => {
      connect.query(queries.$findUserCart, [userID], (err, result) => {
        if (err) {
          connect.release();
          res.sendStatus(500);
          log(err);
        }
        const cartID = result[0].cartID;

        connect.query(
          $addToCartSQL,
          [cartID, productID, quantity, currentTime],
          (err) => {
            connect.release();
            if (err) {
              log(err);
              res.status(500).json({ error: err });
            } else res.status(200).json({ info: "OK" });
          }
        );
      });
    });
  }

  loadCart(req, res) {
    const { userID } = req.params;

    this.createConn((connect) => {
      connect.query(queries.$loadUserCartSQL, [userID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        res.status(200).json({ productsInCart: result });
      });
    });
  }

  deleteFromCart(req, res) {
    const { userID } = req.params;
    const { productID } = req.body;

    this.createConn((connect) => {
      connect.query(queries.$getUserCartIDSQL, [userID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          return res.sendStatus(500);
        }
        const cartID = result[0].cartID;

        connect.query(
          queries.$deleteFromCartSQL,
          [cartID, productID],
          (err, result) => {
            connect.release();
            if (err) {
              log(err);
              return res.sendStatus(500);
            }

            res.status(203).json({ info: "Successfully Remove" });
          }
        );
      });
    });
  }
}

module.exports = CartController;
