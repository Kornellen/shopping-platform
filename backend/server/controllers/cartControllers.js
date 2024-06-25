const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const SecurityUtils = require("../utils/securityUtils");

const log = console.log;

const db = new DBConnect();
const generalUtils = new GeneralUtils();
const security = new SecurityUtils();

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
    const $findUserCart = `
      SELECT Cart.cartID, Cart.userID, Users.userID
      FROM Cart
      LEFT JOIN Users ON Cart.userID = Users.userID
      WHERE Users.userID = ?`;

    const currentTime = generalUtils.getFullCurrentDate();

    this.createConn((connect) => {
      connect.query($findUserCart, [userID], (err, result) => {
        if (err) {
          connect.release();
          res.sendStatus(500);
          log(err);
        }
        const cartID = result[0].cartID;

        const $addToCartSQL = "INSERT INTO cartitems VALUES (null, ?, ?, ?, ?)";

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

    const $loadUserCartSQL = "SELECT * FROM Cart WHERE userID = ?";

    this.createConn((connect) => {
      connect.query($loadUserCartSQL, [userID], (err, result) => {
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

    const $getUserCartIDSQL = "SELECT cartID FROM Carts WHERE userID = ?";

    const $deleteFromCartSQL =
      "DELETE FROM Cartitems WHERE cartID = ? AND productID = ?";

    this.createConn((connect) => {
      connect.query($getUserCartIDSQL, [userID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          return res.sendStatus(500);
        }
        const cartID = result[0].cartID;

        connect.query(
          $deleteFromCartSQL,
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
