const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");

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

    const $findUserWishlistSQL = `
    SELECT Wishlists.wishlistID FROM Wishlists WHERE Wishlists.userID = ?`;

    const $addToWishlistSQL = `INSERT INTO Wishlistitems (wishlistID, productID) VALUES (?,?)`;

    this.getConn((connect) => {
      connect.query($findUserWishlistSQL, [userID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          res.sendStatus(500);
        }
        const wishlistID = result[0].wishlistID;

        connect.query(
          $addToWishlistSQL,
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

    const $getWishlistItemsByUserID =
      "SELECT * FROM WishlistItems LEFT JOIN Wishlists ON WishlistItems.wishlistID = Wishlists.wishlistID WHERE Wishlists.userID = ?";

    this.getConn((connect) => {
      connect.query($getWishlistItemsByUserID, [userID], (err, result) => {
        connect.release();
        if (err) {
          log(err);
          res.sendStatus(500);
        }
        res.status(200).json({ wishlistItems: result });
      });
    });
  }

  removeFromWishlist(req, res) {
    const { userID } = req.params;
    const { productID } = req.body;

    const $getWishlistItemsIDSQL =
      "SELECT Wishlists.wishlistID FROM WishlistItems LEFT JOIN Wishlists ON WishlistItems.wishlistID = Wishlists.wishlistID WHERE Wishlists.userID = ?";
    const $removeFromWishlistSQL =
      "DELETE FROM WishlistItems WHERE wishlistID = ? and productID = ?";

    this.getConn((connect) => {
      connect.query($getWishlistItemsIDSQL, [userID], (err, result) => {
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
          $removeFromWishlistSQL,
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
