const mysql = require("mysql");
const dbconf = require("../config/database");

class DBConnect {
  constructor() {
    this.pool = mysql.createPool(dbconf);
  }

  getConnection(callback) {
    this.pool.getConnection((err, con) => {
      if (err) {
        return callback(err, null);
      }
      return callback(err, con);
    });
  }

  endConnection(callback) {
    this.pool.end((err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  }
}

module.exports = DBConnect;
