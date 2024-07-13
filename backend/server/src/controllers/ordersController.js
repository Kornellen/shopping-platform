const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/ordersQueries");

const db = new DBConnect();
const generalUtils = new GeneralUtils();
const log = generalUtils.log;

class Orders {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        log(err);
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  createOrder(req, res) {
    const { userID } = req.params;
    const { totalAmount, products, shippingMethod } = req.body;

    const currentDate = generalUtils.getOnlyDate();

    //getting Addresses
    this.getConn((connect) => {
      connect.query(
        queries.$getShoppingBillingAddressIDSQL,
        [userID],
        (err, result) => {
          if (err) {
            connect.release();
            log(err);
            return res.sendStatus(500);
          }
          const address = result.map((address) => address.addressID);

          connect.query(
            queries.$getCostOfShippingMethod,
            [shippingMethod],
            (err, result) => {
              if (err) {
                connect.release();
                log(err);
                return res.sendStatus(500);
              }

              const cost = result[0].cost;

              const fullAmount = totalAmount + cost;

              connect.query(
                queries.$insertOrderSQL,
                [
                  userID,
                  currentDate,
                  fullAmount,
                  address,
                  address,
                  shippingMethod,
                ],
                (err, result) => {
                  if (err) {
                    connect.release();
                    log(err);
                    return res.sendStatus(500);
                  }

                  if (products.length == 0) {
                    connect.release();
                    return res
                      .status(400)
                      .json({ error: "Products are required" });
                  }

                  const orderID = result.insertId;

                  connect.query(
                    queries.dynamicQuery(products, orderID)
                      .$insertOrderProductSQL,
                    queries.dynamicQuery(products, orderID).values,
                    (err, result) => {
                      connect.release();
                      if (err) {
                        log(err);
                        return res.sendStatus(500);
                      }
                      res.status(200).json({
                        info: "Ordered",
                        orderID: orderID,
                        totalCoast: fullAmount,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  getUserOrders(req, res) {
    const { userID } = req.params;

    this.getConn((connect) => {
      connect.query(queries.$getOrdersSQL, userID, (err, result) => {
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

    this.getConn((connect) => {
      connect.query(queries.$getOrderStatusSQL, orderID, (err, result) => {
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

    this.getConn((connect) => {
      connect.query(queries.$cancellOrderSQL, [orderID], (err, result) => {
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
