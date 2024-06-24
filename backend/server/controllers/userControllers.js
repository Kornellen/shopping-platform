const DBConnect = require("../utils/dbConnect");
const SecurityUtils = require("../utils/securityUtils");
const GeneralUtils = require("../utils/generalUtils");

const log = console.log;

const db = new DBConnect();
const security = new SecurityUtils();
const generalUtils = new GeneralUtils();

class UserController {
  async createConn(callback, res) {
    db.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return callback(connection);
    });
  }

  createUser(req, res) {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dob,
      gender,
    } = req.body;

    const createdAt = generalUtils.getFullCurrentDate();
    const hashedPassword = security.hashPassword(password);

    const $createUserSQL =
      "INSERT INTO users values (null, ?,?,?,?,?,?,?,?,?,?)";

    this.createConn((connection) => {
      try {
        connection.query(
          $createUserSQL,
          [
            username,
            email,
            hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            dob,
            gender,
            createdAt,
            createdAt,
          ],
          (err, result) => {
            try {
              if (err) {
                res.status(500).json({ error: err.message });
              }

              const $createCartSQL = "INSERT INTO cart VALUES (null, ?, ?, ?)";
              const createTime = generalUtils.getFullCurrentDate();

              connection.query(
                $createCartSQL,
                [result.insertId, createTime, createTime],
                (err) => {
                  connection.release();
                  if (err) {
                    res.sendStatus(500);
                    log(err);
                  } else
                    res
                      .status(200)
                      .json({ info: "Success", userID: result.insertId });
                }
              );
            } catch (err) {
              log(err);
            }
          }
        );
      } catch (err) {
        res.sendStatus(500);
        log(err);
      }
    });
  }
  login(req, res) {
    const { username, password } = req.body;
    const hashedPassword = security.hashPassword(password);

    const $findUserByIDSQL =
      "SELECT password, userID FROM users where username = ?";
    this.createConn((connect) => {
      connect.query($findUserByIDSQL, [username], (err, result) => {
        connect.release();
        if (result.length !== 0) {
          if (hashedPassword === result[0].password) {
            res.status(202).json({
              info: "Authenticated",
              username: result[0].username,
              userID: result[0].userID,
            });
          } else res.status(403).json({ error: "Incorect Password" });
        } else res.status(404).json({ error: "User Not Found" });
      });
    });
  }

  addAddresses(req, res) {
    const { userID, addressLine, city, state, postalCode, country } = req.body;
    const createTime = generalUtils.getFullCurrentDate();

    const $insertAddressSQL =
      "INSERT INTO addresses VALUES (?,?,?,?,?,?,?,?,?)";
    this.createConn((connect) => {
      connect.query(
        $insertAddressSQL,
        [
          userID,
          addressLine,
          city,
          state,
          postalCode,
          country,
          createTime,
          createTime,
        ],
        (err) => {
          connect.release();
          if (err) {
            res.sendStatus(500);
          }

          res.status(200).json({ info: "Success" });
        }
      );
    });
  }
  updateUsername(req, res) {
    const { userID, newUsername, password } = req.body;
    const updateTime = generalUtils.getFullCurrentDate();
    const hashedPassword = security.hashPassword(password);

    const $updateUsernameSQL =
      "UPDATE users SET username = ?, updatedAt = ? where userID = ? and password = ?";
    this.createConn((connect) => {
      connect.release();
      connect.query(
        $updateUsernameSQL,
        [newUsername, updateTime, userID, hashedPassword],
        (err, result) => {
          if (result.changedRows == 0) {
            res.status(403).json({ error: "Wrong Password" });
          } else res.status(200).json({ info: "Success" });
        }
      );
    });
  }
  changePassword(req, res) {
    const { userID, password, newPassword } = req.body;
    const updateTime = generalUtils.getFullCurrentDate();

    const hashedNewPassword = security.hashPassword(newPassword);
    const hashedOldPassword = security.hashPassword(password);
    const $changePasswordSQL =
      "UPDATE users set password = ?, updatedAt = ? where userID = ? and password = ?";
    this.createConn((connect) => {
      connect.query(
        $changePasswordSQL,
        [hashedNewPassword, updateTime, userID, hashedOldPassword],
        (err, result) => {
          connect.release();
          if (result.changedRows == 0) {
            res.status(403).json({ error: "Wrong Password" });
          } else res.status(200).json({ info: "Success" });
        }
      );
    });
  }
}

module.exports = UserController;
