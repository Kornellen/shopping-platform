module.exports = {
  $getUserRequestsSQL: "SELECT * FROM returnsrequests WHERE userID = ?",
  $addRequestToDBSQL:
    "INSERT INTO returnsrequests(orderID, userID, reason, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?)",
  $removeReturnRequest: "DELETE FROM returnsrequests WHERE requestId = ?",
};
