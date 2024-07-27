export default {
  $insertReviewSQL:
    "INSERT INTO Reviews(productID, userID, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)",
  $checkReviewSQL: "SELECT * FROM Reviews WHERE reviewID = ?",
  $removeReviewSQL: "DELETE FROM Reviews WHERE reviewID = ?",
};
