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

    const $getShoppingBillingAddressIDSQL = `
    SELECT addressID
    FROM Addresses
    WHERE userID = ?
    `;

    const $insertOrderSQL = `
    INSERT INTO
    Orders(userID, orderDate, status, totalamount, shoppingAddressID, billingAddressID)
    VALUES (?,?,'ordered',?,?,?)`;

    this.getConn((connect) => {
      connect.query(
        $getShoppingBillingAddressIDSQL,
        [userID],
        (err, result) => {
          if (err) {
            log(err);
            return res.sendStatus(500);
          }
          const address = result.map((address) => address.addressID);

          connect.query(
            $insertOrderSQL,
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
              const placeholdes = orderedItems
                .map(() => "(?,?,?,?)")
                .join(", ");

              const values = orderedItems.reduce(
                (acc, val) => acc.concat(val),
                []
              );

              const $insertOrderProductSQL = `
            INSERT INTO
            OrderItems(orderID, productID, quantity, price)
            VALUES ${placeholdes}`;

              connect.query($insertOrderProductSQL, values, (err, result) => {
                connect.release();
                if (err) {
                  log(err);
                  res.sendStatus(500);
                }
                res.status(200).json({ info: "Ordered", orderID: orderID });
              });
            }
          );
        }
      );
    });
  }

  getUserOrders(req, res) {
    const { userID } = req.params;

    const $getOrdersSQL = `SELECT * FROM Orders WHERE userID = ?`;

    this.getConn((connect) => {
      connect.query($getOrdersSQL, userID, (err, result) => {
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

    const $getOrderStatusSQL =
      "SELECT status, orderDate FROM Orders WHERE orderID = ?";

    this.getConn((connect) => {
      connect.query($getOrderStatusSQL, orderID, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        res.status(200).json({ orderStatus: result[0] });
      });
    });
  }

  cancellOrder(req, res) {
    const { orderID } = req.params;

    const $cancellOrderSQL = `UPDATE orders SET status = "cancelled" WHERE orderID = ?`;

    this.getConn((connect) => {
      connect.query($cancellOrderSQL, [orderID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        res.status(200).json({ info: `Cancelled order: ${orderID}` });
      });
    });
  }
}

module.exports = Orders;
