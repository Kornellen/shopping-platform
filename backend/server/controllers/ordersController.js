const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");

const db = new DBConnect();
const generalUtils = new GeneralUtils();
const log = generalUtils.log;

class Orders {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  createOrder(req, res) {
    const { userID } = req.params;
    const { totalAmount, products } = req.body;

    const currentDate = generalUtils.getOnlyDate();

    const $getShoppingBillingAddressID = `
    SELECT addressID
    FROM Addresses
    WHERE userID = ?
    `;

    const $insertOrder = `
    INSERT INTO
    Orders(userID, orderDate, status, totalamount, shoppingAddressID, billingAddressID)
    VALUES (?,?,'ordered',?,?,?)`;

    this.getConn((connect) => {
      connect.query($getShoppingBillingAddressID, [userID], (err, result) => {
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        const address = result.map((address) => address.addressID);

        connect.query(
          $insertOrder,
          [userID, currentDate, totalAmount, address, address],
          (err, result) => {
            if (err) {
              log(err);
              return res.sendStatus(500);
            }

            if (products.length == 0) {
              return res.status(400).json({ error: "Products are required" });
            }

            const orderID = result.insertId;
            const orderedItems = products.map((product) => [
              orderID,
              product.productID,
              product.quantity,
              product.price,
            ]);
            const placeholdes = orderedItems.map(() => "(?,?,?,?)").join(", ");

            const values = orderedItems.reduce(
              (acc, val) => acc.concat(val),
              []
            );

            const $insertOrderProduct = `
            INSERT INTO
            OrderItems(orderID, productID, quantity, price)
            VALUES ${placeholdes}`;

            connect.query($insertOrderProduct, values, (err, result) => {
              connect.release();
              if (err) {
                log(err);
                res.sendStatus(500);
              }
              res.status(200).json({ info: "Ordered", orderID: orderID });
            });
          }
        );
      });
    });
  }

  getUserOrders(req, res) {
    const { userID } = req.params;

    const $getOrders = `SELECT * FROM Orders WHERE userID = ?`;

    this.getConn((connect) => {
      connect.query($getOrders, userID, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        if (result.length == 0) {
          res.status(200).json({ orders: "You don't have orders" });
        } else res.status(200).json({ orders: result });
      });
    });
  }

  getOrderStatus(req, res) {
    const { orderID } = req.params;

    const $getOrderStatus =
      "SELECT status, orderDate FROM Orders WHERE orderID = ?";

    this.getConn((connect) => {
      connect.query($getOrderStatus, orderID, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        res.status(200).json({ orderStatus: result[0] });
      });
    });
  }
}

module.exports = Orders;
