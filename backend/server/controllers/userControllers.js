const DBConnect = require("../utils/dbConnect");
const SecurityUtils = require("../utils/securityUtils");
const GeneralUtils = require("../utils/generalUtils");
const queries = require("../sql/userQueries");
const userQueries = require("../sql/userQueries");

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

    this.createConn((connection) => {
      try {
        connection.query(
          queries.$createUserSQL,
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
                connection.release();
                log(err);
                return res.status(500).json({ error: err.message });
              }

              const createTime = generalUtils.getFullCurrentDate();
              const userID = result.insertId;

              connection.query(
                queries.$createCartSQL,
                [result.insertId, createTime, createTime],
                (err) => {
                  if (err) {
                    connection.release();
                    log(err);
                    return res.sendStatus(500);
                  }

                  const cartID = result.insertId;

                  connection.query(
                    queries.$createWishlistSQL,
                    [userID, createTime],
                    (err, result) => {
                      connection.release();
                      if (err) {
                        log(err);
                        return res.sendStatus(500);
                      }
                      const wishlistID = result.insertId;
                      res.status(200).json({
                        info: "Success",
                        userID: userID,
                        cartID: cartID,
                        wishlistID: wishlistID,
                      });
                    }
                  );
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

    this.createConn((connect) => {
      connect.query(
        queries.$findUserByUsernameSQL,
        [username],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            res.sendStatus(500);
          }

          if (result.length !== 0) {
            if (hashedPassword === result[0].password) {
              res.status(202).json({
                info: "Authenticated",
                userID: result[0].userID,
              });
            } else res.status(403).json({ error: "Incorect Password" });
          } else res.status(404).json({ error: "User Not Found" });
        }
      );
    });
  }

  addAddresses(req, res) {
    const { userID, addressLine, city, state, postalCode, country } = req.body;
    const createTime = generalUtils.getFullCurrentDate();

    this.createConn((connect) => {
      connect.query(
        queries.$insertAddressSQL,
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
            log(err);
            return res.sendStatus(500);
          }

          return res.status(200).json({ info: "Success" });
        }
      );
    });
  }

  updateUserDatas(req, res) {
    const { userID, email, phone, password } = req.body;

    const updatedAt = generalUtils.getFullCurrentDate();

    const hashedPassword = security.hashPassword(password);

    const updates = [];

    if (email != null && email != undefined && email != "") {
      updates.push({ column: "email", value: email });
    }

    if (phone != null && phone != undefined && phone != "") {
      updates.push({ column: "phoneNumber", value: phone });
    }

    const column = updates.map((column) => `${column.column} = ?`).join(", ");
    const value = updates.map((value) => value.value);

    const sql = `UPDATE users SET ${column}, updatedAt = ? WHERE userID = ? AND password = ?`;

    this.createConn((connect) => {
      connect.query(
        sql,
        [value, updatedAt, userID, hashedPassword],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          if (result.changedRows !== 0) {
            return res.status(200).json({ info: "Success" });
          }
          return res.status(401).json({ error: "Bad Datas" });
        }
      );
    });
  }

  updateUserAddress(req, res) {
    const { userID, password, addressLine, city, state, postalCode, country } =
      req.body;

    const updates = [];

    const updateAt = generalUtils.getFullCurrentDate();
    const hashedPassword = security.hashPassword(password);

    if (addressLine != null && addressLine != undefined && addressLine != "") {
      updates.push({ column: "addressLine", value: addressLine });
    }

    if (city != null && city != undefined && city != "") {
      updates.push({ column: "city", value: city });
    }
    if (state != null && state != undefined && state != "") {
      updates.push({ column: "state", value: state });
    }

    if (postalCode != null && postalCode != undefined && postalCode != "") {
      updates.push({ column: "postalCode", value: postalCode });
    }
    if (country != null && country != undefined && country != "") {
      updates.push({ column: "country", value: country });
    }

    const column = updates
      .map((update) => `addresses.${update.column} = ?`)
      .join(",");
    const value = updates.map((value) => value.value);
    const sql = `UPDATE addresses JOIN users ON addresses.userID = users.userID SET ${column}, addresses.updatedAt = ? WHERE addresses.userID = ? AND users.password = ?`;

    this.createConn((connect) => {
      connect.query(
        sql,
        [...value, updateAt, userID, hashedPassword],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          if (result.changedRows === 0) {
            return res.status(401).json({ error: "Bad Datas" });
          }

          return res.status(200).json({ info: "Success" });
        }
      );
    });
  }

  updateUsername(req, res) {
    const { userID, newUsername, password } = req.body;
    const updateTime = generalUtils.getFullCurrentDate();
    const hashedPassword = security.hashPassword(password);

    this.createConn((connect) => {
      connect.query(
        queries.$updateUsernameSQL,
        [newUsername, updateTime, userID, hashedPassword],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }

          if (result.changedRows == 0) {
            return res.status(403).json({ error: "Wrong Password" });
          } else return res.status(200).json({ info: "Success" });
        }
      );
    });
  }

  changePassword(req, res) {
    const { userID, password, newPassword } = req.body;
    const updateTime = generalUtils.getFullCurrentDate();

    const hashedNewPassword = security.hashPassword(newPassword);
    const hashedOldPassword = security.hashPassword(password);

    this.createConn((connect) => {
      connect.query(
        queries.$changePasswordSQL,
        [hashedNewPassword, updateTime, userID, hashedOldPassword],
        (err, result) => {
          connect.release();
          if (err) {
            log(err);
            return res.sendStatus(500);
          }
          if (result.changedRows == 0) {
            res.status(403).json({ error: "Wrong Password" });
          } else res.status(200).json({ info: "Success" });
        }
      );
    });
  }

  getUserDatas(req, res) {
    const { userID } = req.query;

    this.createConn((connect) => {
      connect.query(userQueries.$getUserDatasByID, [userID], (err, result) => {
        connect.release();
        if (err) {
          return res.sendStatus(500);
        }

        return res.status(200).json({ result: result });
      });
    });
  }

  getUserAddresses(req, res) {
    const { userID } = req.query;

    this.createConn((connect) => {
      connect.query(userQueries.$getUserAddresses, [userID], (err, result) => {
        connect.release();
        if (err) {
          return res.sendStatus(500);
        }

        return res.status(200).json({ result: result[0] });
      });
    });
  }

  getAllUsers(req, res) {
    this.createConn((connect) => {
      connect.query(userQueries.$getAllUsers, (err, result) => {
        connect.release();
        if (err) {
          log(err);
          return res.sendStatus(500);
        }
        return res.status(200).json({ result: result });
      });
    });
  }
}

module.exports = UserController;
