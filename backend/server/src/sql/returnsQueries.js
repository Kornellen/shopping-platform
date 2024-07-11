module.exports = {
  $getUserRequestsSQL: "SELECT * FROM returnsrequests WHERE userID = ?",
  $addRequestToDBSQL:
    "INSERT INTO returnsrequests(orderID, userID, reason, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
  $removeReturnRequest: "DELETE FROM returnsrequests WHERE requestID = ?",
  $searchUserEmail: "SELECT email FROM Users WHERE userID = ?",
  $getReturnRequestDetails: "SELECT * FROM returnsrequests WHERE requestID = ?",
  $updateRequestStatus:
    "UPDATE returnsrequests SET status = ?, updatedAt = ? WHERE requestID = ?",
};
