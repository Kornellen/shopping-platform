module.exports = {
  $getUserRequestsSQL: "SELECT * FROM returnsrequests WHERE userID = ?",
  $addRequestToDBSQL:
    "INSERT INTO returnsrequests(orderID, userID, reason, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
  $removeReturnRequest: "DELETE FROM returnsrequests WHERE requestID = ?",
  $searchUserEmail:
    "SELECT DISTINCT users.email FROM orders JOIN orderitems ON orderitems.orderID = orders.orderID JOIN products ON orderitems.productID = products.productID JOIN users ON users.userID = products.userID WHERE orders.orderID = ?;",
  $getReturnRequestDetails: "SELECT * FROM returnsrequests WHERE requestID = ?",
  $updateRequestStatus:
    "UPDATE returnsrequests SET status = ?, updatedAt = ? WHERE requestID = ?",
};
