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
  getProduct(req, res) {
    const $getProducts = "SELECT * FROM Products";

    this.getConn((connect) => {
      connect.query($getProducts, (err, result) => {
        if (err) {
          connect.release();
          res.sendStatus(500);
        }
        const $getProductCat = `
        SELECT Categories.name, Categories.categoryID
        FROM Categories
        LEFT JOIN Products ON Categories.categoryID = Products.categoryID
        WHERE Products.categoryID in (?)`;

        const categories = result.map((element) => element.categoryID);

        connect.query($getProductCat, [categories], (err, categories) => {
          connect.release();
          if (err) {
            res.sendStatus(500);
            log(err);
          }

          const categoryObject = categories.reduce((acc, category) => {
            acc[category.categoryID] = category.name;

            return acc;
          }, {});

          const products = result.map((element, index) => ({
            productID: element.productID,
            category: categoryObject[element.categoryID] || "Unknown",
            name: element.name,
            description: element.description,
            price: element.price,
            stockQuantity: element.stockQuantity,
            addedAt: element.addedAt,
            updatedAt: element.updatedAt,
          }));

          res.status(200).json({ products: products });
        });
      });
    });
  }
}

module.exports = Product;
