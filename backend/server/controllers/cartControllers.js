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
    const { userID, productID, quantity } = req.body;
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
            if (err) {
              res.status(500).json({ error: err });
            } else res.status(200).json({ info: "OK" });
          }
        );
      });
    });
  }
}

module.exports = CartController;
