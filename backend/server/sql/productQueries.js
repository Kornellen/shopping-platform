module.exports = {
  $addProductSQL:
    "INSERT INTO Products (categoryID, userID, name, description, price, stockQuantity, addedAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)",
  $getProducts:
    "SELECT Categories.categoryName, Users.username, Products.productID, products.name, products.description, products.price, products.stockQuantity FROM Products JOIN Users ON Products.userID = Users.userID JOIN Categories ON Categories.categoryID = Products.categoryID",
  $getProductCat: `
        SELECT Categories.name, Categories.categoryID
        FROM Categories
        LEFT JOIN Products ON Categories.categoryID = Products.categoryID
        WHERE Products.categoryID in (?)`,
  $getProductByIdSQL: "SELECT * FROM products where productID = ?",
  $getProductCommentsSQL: `
      SELECT Reviews.rating, Reviews.comment, Reviews.createdAt, Users.username
      FROM Reviews
      LEFT JOIN Users
      ON Reviews.userID = Users.userID
      WHERE Reviews.productID = ?`,
  $getProductsByName:
    "SELECT Users.username, Categories.categoryName, Products.productID, products.name, products.description, products.price, products.stockQuantity FROM Products JOIN Users ON Products.userID = users.userID JOIN categories ON products.categoryID = categories.categoryID WHERE products.name LIKE ? OR products.description LIKE ?",
};
