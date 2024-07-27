import database from "../config/database";

import mysql, { Pool } from "mysql";

class DBConnect {
  private pool: Pool;
  constructor() {
    this.pool = mysql.createPool(database);
  }

  getConnection(
    callback: (err: Error, con: mysql.PoolConnection | null) => void
  ) {
    this.pool.getConnection((err, con) => {
      if (err) {
        return callback(err, null);
      }
      return callback(err, con);
    });
  }

  endConnection(callback: (err: Error | null) => void) {
    this.pool.end((err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  }
}

export default DBConnect;
