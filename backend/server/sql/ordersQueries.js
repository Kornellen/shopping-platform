const dynamicQuery = (products) => {
  const orderedItems = products.map((product) => [
    orderID,
    product.productID,
    product.quantity,
    product.price,
  ]);
  const placeholdes = orderedItems.map(() => "(?,?,?,?)").join(", ");

  const values = orderedItems.reduce((acc, val) => acc.concat(val), []);

  return {
    $insertOrderProductSQL: `
    INSERT INTO
    OrderItems(orderID, productID, quantity, price)
    VALUES ${placeholdes}`,
    value: values,
  };
};

module.exports = {
  $getCostOfShippingMethod: `
      SELECT cost
      FROM ShippingMethods
      WHERE shippingMethodID = ?`,
  $getShoppingBillingAddressIDSQL: `
    SELECT addressID
    FROM Addresses
    WHERE userID = ?
    `,
  $insertOrderSQL: `
    INSERT INTO
    Orders(userID, orderDate, status, totalamount, shoppingAddressID, billingAddressID, shippingMethod)
    VALUES (?,?,'ordered',?,?,?,?)`,
  dynamicQuery,
  $getOrdersSQL: `SELECT * FROM Orders WHERE userID = ?`,
  $getOrderStatusSQL: "SELECT status, orderDate FROM Orders WHERE orderID = ?",
  $cancellOrderSQL: `UPDATE orders SET status = "cancelled" WHERE orderID = ?`,
};
