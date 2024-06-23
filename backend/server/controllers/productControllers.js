const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");

const log = console.log;

const db = new DBConnect();
const generalUtils = new GeneralUtils();

class Product {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  addProduct(req, res) {
    const { categoryID, name, desc, price, stockQuantity } = req.body;
    const addedAt = generalUtils.getFullCurrentDate();

    const $addProductSQL = "INSERT INTO Products VALUES (null, ?,?,?,?,?,?,?)";

    this.getConn((connect) => {
      connect.query(
        $addProductSQL,
        [categoryID, name, desc, price, stockQuantity, addedAt, addedAt],
        (err) => {
          connect.release();
          if (err) {
            res.sendStatus(500);
            log(err);
          }
          res.status(200).json({ info: "Success" });
        }
      );
    });
  }
}

module.exports = Product;
