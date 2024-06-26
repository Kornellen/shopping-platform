module.exports = {
  $insertPaymentSQL:
    "INSERT INTO payments(orderID, userID, paymentDate, amount, paymentMethodID, status) VALUES (?,?,?,?,?,?)",
  $getPaymentDetailsSQL: "SELECT * FROM payments WHERE orderID = ?",
  $getUserPaymentsSQL: "SELECT * FROM Payments WHERE userID = ?",
  $updatePaymentStatusSQL: "UPDATE Payments SET status = ? WHERE paymentID = ?",
};
