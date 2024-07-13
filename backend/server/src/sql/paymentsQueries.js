module.exports = {
  $insertPaymentSQL:
    "INSERT INTO payments(orderID, userID, paymentDate, amount, paymentMethodID, status) VALUES (?,?,?,?,?,?)",
  $getPaymentDetailsSQL: "SELECT * FROM payments WHERE orderID = ?",
  $getUserPaymentsSQL: `SELECT payments.paymentID, payments.userID, MAX(payments.paymentDate) AS paymentDate, payments.status, MAX(payments.amount) AS amount, paymentmethods.paymentMethod, payments.status, GROUP_CONCAT(products.name ORDER BY products.name SEPARATOR ', ') AS products, GROUP_CONCAT(products.productID ORDER BY products.name SEPARATOR ', ') AS productIDs, GROUP_CONCAT(products.price ORDER BY products.name SEPARATOR ', ') as productsPrice, GROUP_CONCAT(orderitems.quantity ORDER BY products.name SEPARATOR ', ') as quantity, orders.orderID, shippingmethods.name as shippingMethodName, shippingmethods.cost as shippingMethodCost 
    FROM payments
    JOIN paymentmethods
    ON payments.paymentMethodID = paymentmethods.paymentMethodID
    JOIN orders
    ON payments.orderID = orders.orderID
    JOIN orderitems
    ON payments.orderID = orderitems.orderID
    JOIN products
    ON products.productID = orderitems.productID
    JOIN shippingmethods
    ON orders.shippingMethod = shippingmethods.shippingMethodID
    WHERE payments.userID = ?
    GROUP BY payments.orderID`,
  $updatePaymentStatusSQL: "UPDATE Payments SET status = ? WHERE paymentID = ?",
};
