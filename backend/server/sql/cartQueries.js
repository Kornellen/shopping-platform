module.exports = {
  $findUserCart: `
      SELECT Cart.cartID, Cart.userID, Users.userID
      FROM Cart
      LEFT JOIN Users ON Cart.userID = Users.userID
      WHERE Users.userID = ?`,
  $addToCartSQL: "INSERT INTO cartitems VALUES (null, ?, ?, ?, ?)",
  $loadUserCartSQL: "SELECT * FROM Cart WHERE userID = ?",
  $loadCartItemNameSQL:
    "SELECT Products.name, Products.price, Products.productID, cartitems.quantity FROM cartitems JOIN products ON products.productID = cartitems.productID WHERE cartitems.cartID = ?",
  $getUserCartIDSQL: "SELECT cartID FROM Cart WHERE userID = ?",
  $deleteFromCartSQL:
    "DELETE FROM Cartitems WHERE cartID = ? AND productID = ?",
  $updateProductQunatitySQL:
    "UPDATE Cartitems SET quantity = ? WHERE cartID = ? AND productID = ?",
};
