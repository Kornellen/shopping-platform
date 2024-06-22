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
              connection.release();

              if (err) {
                res.status(500).json({ error: err.message });
              }

              res
                .status(200)
                .json({ info: "Success", userID: result.insertId });
            } catch (err) {
              log(err);
            }
          }
        );
      } catch (err) {
        res.sendStatus(500);
        log(err);
      }
    }, res);
  }
  login(req, res) {
    const { username, password } = req.body;
    const hashedPassword = security.hashPassword(password);

    const $findUserByIDSQL = "SELECT password FROM users where username = ?";
    this.createConn((connect) => {
      connect.query($findUserByIDSQL, [username], (err, result) => {
        connect.release();
        if (result.length !== 0) {
          if (hashedPassword === result[0].password) {
            res
              .status(202)
              .json({ info: "Authenticated", username: result[0].username });
          } else res.status(403).json({ error: "Incorect Password" });
        } else res.status(404).json({ error: "User Not Found" });
      });
    }, res);
  }
}

module.exports = UserController;
