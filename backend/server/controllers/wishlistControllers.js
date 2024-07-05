const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/wishlistQueries");

const db = new DBConnect();
const generalUtils = new GeneralUtils();
const log = generalUtils.log;

class Wishlist {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  addToWishlist(req, res) {
    const { userID } = req.params;
    const { productID } = req.body;

    this.getConn((connect) => {
      connect.query(queries.$findUserWishlistSQL, [userID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          res.sendStatus(500);
        }
        const wishlistID = result[0].wishlistID;

        connect.query(
          queries.$addToWishlistSQL,
          [wishlistID, productID],
          (err, result) => {
            connect.release();
            if (err) {
              log(err);
              res.sendStatus(500);
            }

            res.status(200).json({ info: "Successfully added to wishlist" });
          }
        );
      });
    });
  }

  getWishlist(req, res) {
    const { userID } = req.params;

    this.getConn((connect) => {
      connect.query(
        queries.$getWishlistItemsByUserID,
        [userID],
        (err, result) => {
          if (err) {
            connect.release();
            log(err);
            return res.sendStatus(500);
          }

          if (result.length === 0) {
            connect.release();
            return res.status(404).json({ error: "Wishlist not found" });
          }

          const wishlistID = result[0].wishlistID;

          connect.query(
            queries.$getWishlistItemsSQL,
            [wishlistID],
            (err, result) => {
              connect.release();
              if (err) {
                log(err);
                return res.sendStatus(500);
              }

              return res.status(200).json({ wishlistItems: result });
            }
          );
        }
      );
    });
  }

  removeFromWishlist(req, res) {
    const { userID } = req.params;
    const { productID } = req.body;

    this.getConn((connect) => {
      connect.query(queries.$getWishlistItemsIDSQL, [userID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          return res.sendStatus(500);
        }
        if (result.length === 0) {
          connect.release();
          return res.status(404).json({ error: "Item Not Found" });
        }

        const wishlistID = result[0].wishlistID;
        connect.query(
          queries.$removeFromWishlistSQL,
          [wishlistID, productID],
          (err, result) => {
            connect.release();
            if (err) {
              log(err);
              return res.sendStatus(500);
            }
            res.status(200).json({ info: "Removed Successfully" });
          }
        );
      });
    });
  }
}

module.exports = Wishlist;
