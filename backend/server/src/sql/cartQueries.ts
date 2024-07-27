export default {
  $loadUserCartSQL: "SELECT * FROM Cart WHERE userID = ?",
  $addToCartSQL:
    "INSERT INTO cartitems(cartID, productID, quantity, addedAt) VALUES (?, ?, ?, ?)",
  $loadCartItemNameSQL:
    "SELECT Products.name, Products.price, Products.productID, cartitems.quantity FROM cartitems JOIN products ON products.productID = cartitems.productID WHERE cartitems.cartID = ?",
  $getUserCartIDSQL: "SELECT cartID FROM Cart WHERE userID = ?",
  $deleteFromCartSQL:
    "DELETE FROM Cartitems WHERE cartID = ? AND productID = ?",
  $updateProductQunatitySQL:
    "UPDATE Cartitems SET quantity = ? WHERE cartID = ? AND productID = ?",
};
