const validateRequest = require("../middleware/validator");
const DBConnect = require("../utils/dbConnect");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/reviewsQueries");

const db = new DBConnect();
const generalUtils = new GeneralUtils();
const log = generalUtils.log;

class Review {
  async getConn(callback, res) {
    db.getConnection((err, connect) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connect);
    });
  }

  addReview(req, res) {
    const { productID } = req.params;
    const { userID, rating, comment } = req.body;
    const createTime = generalUtils.getFullCurrentDate();

    const $insertReviewSQL =
      "INSERT INTO Reviews(productID, userID, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?)";

    this.getConn((connect) => {
      connect.query(
        queries.$insertReviewSQL,
        [productID, userID, rating, comment, createTime],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }
          res
            .status(200)
            .json({ info: "Added New Review", reviewID: result.insertID });
        }
      );
    });
  }

  removeReview(req, res) {
    const { reviewID } = req.params;

    this.getConn((connect) => {
      connect.query(queries.$checkReviewSQL, [reviewID], (err, result) => {
        if (err) {
          connect.release();
          log(err);
          return res.sendStatus(500);
        }

        if (result.length === 0) {
          connect.release();
          res.status(404).json({ error: "Review Not Found" });
        } else
          connect.query(queries.$removeReviewSQL, [reviewID], (err, result) => {
            connect.release();
            if (err) {
              log(err);
              return res.sendStatus(500);
            }

            res.status(200).json({ info: "Successfuly removed" });
          });
      });
    });
  }

  updateReview(req, res) {
    const { reviewID } = req.params;
    const { rating, comment } = req.body;

    const updates = [];

    if (rating !== undefined && rating !== "" && rating != null)
      updates.push({ column: "rating", value: rating });

    if (comment !== undefined && comment !== "" && comment != null)
      updates.push({ column: "comment", value: comment });

    if (updates.length == 0)
      return res.status(400).json({ error: "No fileds to update" });

    const updatedValues = updates.map((update) => update.value);

    this.getConn((connect) => {
      connect.query(
        generalUtils.generateDynamicUpdateQuery("Reviews", updates),
        [...updatedValues, reviewID],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          res.status(200).json({ info: "Successfuly updated" });
        }
      );
    });
  }
}

module.exports = Review;
