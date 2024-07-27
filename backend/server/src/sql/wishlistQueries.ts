export default {
  $findUserWishlistSQL: `
    SELECT Wishlists.wishlistID FROM Wishlists WHERE Wishlists.userID = ?`,
  $addToWishlistSQL: `INSERT INTO Wishlistitems (wishlistID, productID) VALUES (?,?)`,
  $getWishlistItemsByUserID:
    "SELECT Products.name, Products.price, Products.productID FROM WishlistItems LEFT JOIN Wishlists ON WishlistItems.wishlistID = Wishlists.wishlistID JOIN products ON products.productID = wishlistitems.productID WHERE Wishlists.userID = ?",
  $getWishlistItemsSQL:
    "SELECT Products.name, Products.price, Products.productID FROM wishlistitems JOIN products ON products.productID = wishlistitems.productID WHERE wishlistitems.wishlistID = ?",
  $getWishlistItemsIDSQL:
    "SELECT Wishlists.wishlistID FROM WishlistItems LEFT JOIN Wishlists ON WishlistItems.wishlistID = Wishlists.wishlistID WHERE Wishlists.userID = ?",
  $removeFromWishlistSQL:
    "DELETE FROM WishlistItems WHERE wishlistID = ? and productID = ?",
};
