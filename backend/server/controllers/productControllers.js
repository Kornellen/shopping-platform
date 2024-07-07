const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/productQueries");
const { getRandomValues } = require("crypto");
const productQueries = require("../sql/productQueries");
const userQueries = require("../sql/userQueries");

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
    const { userID, categoryID, name, desc, price, stockQuantity } = req.body;
    const addedAt = generalUtils.getFullCurrentDate();

    this.getConn((connect) => {
      connect.query(
        queries.$addProductSQL,
        [
          categoryID,
          userID,
          name,
          desc,
          price,
          stockQuantity,
          addedAt,
          addedAt,
        ],
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

  getProductsByName(req, res) {
    const { itemName } = req.query;

    const formattedName = `%${itemName}%`;

    this.getConn((connect) => {
      connect.query(
        productQueries.$getProductsByName,
        [formattedName, formattedName],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          return res.status(200).json({ result: result });
        }
      );
    });
  }

  removeProduct(req, res) {
    const { productID } = req.body;

    this.getConn((connect) => {
      connect.query(
        productQueries.$removeProduct,
        [productID],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (result.affectedRows != 0) {
            return res.status(200).json({ error: "Success" });
          }
          return res.status(404).json({ error: "Product not found" });
        }
      );
    });
  }

  getAllProduct(req, res) {
    this.getConn((connect) => {
      connect.query(productQueries.$getProducts, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        return res.status(200).json({ products: result });
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

    const values = update.map((update) => update.value);

    this.getConn((connect) => {
      connect.query(
        generalUtils.generateDynamicQuery("products", update),
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

    this.getConn((connect) => {
      connect.query(queries.$getProductByIdSQL, [productID], (err, result) => {
        if (err) {
          log(err);
          return res.sendStatus(500);
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Product Not Found" });
        }

        const productDatas = result[0];

        connect.query(
          queries.$getProductCommentsSQL,
          [productID],
          (err, result) => {
            connect.release();
            if (err) {
              log(err);
              res.sendStatus(500);
            }
            res
              .status(200)
              .json({ productDatas: productDatas, comments: result });
          }
        );
      });
    });
  }
}

module.exports = Product;
