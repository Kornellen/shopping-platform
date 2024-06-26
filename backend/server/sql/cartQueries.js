module.exports = {
  $findUserCart: `
      SELECT Cart.cartID, Cart.userID, Users.userID
      FROM Cart
      LEFT JOIN Users ON Cart.userID = Users.userID
      WHERE Users.userID = ?`,
  $addToCartSQL: "INSERT INTO cartitems VALUES (null, ?, ?, ?, ?)",
  $loadUserCartSQL: "SELECT * FROM Cart WHERE userID = ?",
  $getUserCartIDSQL: "SELECT cartID FROM Carts WHERE userID = ?",
  $deleteFromCartSQL:
    "DELETE FROM Cartitems WHERE cartID = ? AND productID = ?",
};
