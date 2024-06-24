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
  getAllProduct(req, res) {
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

  updateProduct(req, res) {
    const { productID } = req.params;
    const { price, description, stockQuantity, name, category } = req.body;

    const updatedAt = generalUtils.getFullCurrentDate();

    if (!productID) {
      return res.status(400).json({ error: "ProductID is required" });
    }

    const update = [];
    if (price != "" && price != null)
      update.push({ column: "price", value: price });
    if (description != "" && description != null)
      update.push({ column: "description", value: description });
    if (stockQuantity != 0 && stockQuantity != null)
      update.push({ column: "stockQuantity", value: stockQuantity });
    if (name != "" && name != null)
      update.push({ column: "name", value: name });
    if (category != "" && category != null)
      update.push({ column: "categoryID", value: category });

    if (update.length == 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updateColumn = update
      .map((update) => `${update.column} = ?`)
      .join(",");
    const values = update.map((update) => update.value);

    const $updateProductSQL = `UPDATE Products SET ${updateColumn}, updatedAt = ? WHERE productID = ? `;

    this.getConn((connect) => {
      connect.query(
        $updateProductSQL,
        [...values, updatedAt, productID],
        (err, result) => {
          connect.release();
          if (err) {
            return res.status(500).json({ error: err });
          }
          res.status(200).json({ info: "Product Updated Successfully" });
        }
      );
    });
  }

  getProductByIDParam(req, res) {
    const { productID } = req.params;

    const $getProductByIdSQL = "SELECT * FROM products where productID = ?";

    this.getConn((connect) => {
      connect.query($getProductByIdSQL, [productID], (err, result) => {
        connect.release();
        if (err) {
          res.sendStatus(500);
          log(err);
        }

        if (result.length === 0) {
          res.status(404).json({ error: "Product Not Found" });
        } else res.status(200).json({ productDatas: result[0] });
      });
    });
  }
}

module.exports = Product;
