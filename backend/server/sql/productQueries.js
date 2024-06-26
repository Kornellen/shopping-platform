module.exports = {
  $addProductSQL: "INSERT INTO Products VALUES (null, ?,?,?,?,?,?,?)",
  $getProducts: "SELECT * FROM Products",
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
};
