const dynamicQuery = (products, orderID) => {
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
    values: values,
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
  $getOrdersSQL: `SELECT orders.orderID, orders.status, payments.amount as amount, payments.paymentID, shippingMethods.name as shippingMethodName, shippingmethods.cost as shippingMethodCost, GROUP_CONCAT(DISTINCT products.name ORDER BY products.name SEPARATOR ', ') as products, GROUP_CONCAT(DISTINCT products.price ORDER BY products.name SEPARATOR ', ') as productPrices, GROUP_CONCAT( DISTINCT products.productID ORDER BY products.name SEPARATOR ', ') as productIDs, GROUP_CONCAT(DISTINCT orderitems.quantity ORDER BY products.name SEPARATOR ', ') as quantity, paymentmethods.paymentMethod, MAX(payments.paymentDate) as paymentDate FROM orders JOIN shippingMethods ON orders.shippingMethod = shippingmethods.shippingMethodID JOIN payments ON payments.orderID = orders.orderID JOIN orderitems ON orders.orderID = orderitems.orderID JOIN products ON products.productID = orderitems.productID JOIN paymentmethods ON payments.paymentMethodID = paymentmethods.paymentMethod WHERE orders.userID = ? GROUP BY orders.orderID`,
  $getOrderStatusSQL: "SELECT status, orderDate FROM Orders WHERE orderID = ?",
  $cancellOrderSQL: `UPDATE orders SET status = "cancelled" WHERE orderID = ?`,
};
