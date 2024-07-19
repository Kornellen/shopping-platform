import mysql from "mysql";
import DBConnect from "../../../utils/dbConnect";
import SecurityUtils from "../../../utils/securityUtils";
import GeneralUtils from "../../../utils/generalUtils";

import { Request, Response } from "express";

import { log } from "console";
import userQueries from "../../../sql/userQueries";

const db = new DBConnect();
const security = new SecurityUtils();
const generalUtils = new GeneralUtils();

class UserServices {
  async createConn(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      db.getConnection((err, connection) => {
        if (err) {
          log(err);
          reject(err);
        } else if (connection === null) {
          reject("Connection is null");
        } else {
          resolve(connection as mysql.PoolConnection);
        }
      });
    });
  }

  async createUser(req: Request, res: Response) {
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

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      await new Promise<void>((resolve, reject) =>
        connection?.beginTransaction((err) => (err ? reject(err) : resolve()))
      );

      //User
      const userResult = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            userQueries.$createUserSQL,
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
              err ? reject(err) : resolve(result);
            }
          );
        }
      );

      const userID = userResult.insertId;

      //Cart
      await new Promise<void>((resolve, reject) => {
        connection?.query(
          userQueries.$createCartSQL,
          [userID, createdAt, createdAt],
          (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });

      //Wishlist
      const wishlistResult = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            userQueries.$createWishlistSQL,
            [userID, createdAt],
            (err, result) => {
              err ? reject(err) : resolve(result);
            }
          );
        }
      );

      const wishlistID = wishlistResult.insertId;

      //Commit
      await new Promise<void>((resolve, reject) =>
        connection?.commit((err) => {
          err ? reject(err) : resolve();
        })
      );

      return res.status(200).json({
        info: "Success",
        userID: userID,
        cartID: userResult.insertId,
        wishlistID,
      });
    } catch (error: any) {
      if (connection) {
        await new Promise<void>((resolve, reject) =>
          connection?.rollback(() => {
            return res.status(500).json({ error: error.sqlMessage });
          })
        );
      } else {
        return res.status(500).json({ error: error });
      }

      log(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const hashedPassword = security.hashPassword(password);

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();

      const userData = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          userQueries.$findUserByUsernameSQL,
          [username],
          (err, result) => {
            if (err) {
              log(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      if (userData.length === 0) {
        return res.status(404).json({ error: "User Not Found" });
      }
      const user = userData[0];

      if (hashedPassword === user.password) {
        return res.status(202).json({
          info: "Authenticated",
          userID: user.userID,
        });
      } else {
        return res.status(403).json({ error: "Incorrect Password" });
      }
    } catch (error) {
      res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async addAddresses(req: Request, res: Response) {
    const { userID, addressLine, city, state, postalCode, country } = req.body;
    const createTime = generalUtils.getFullCurrentDate();

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();

      await new Promise<void>((resolve, reject) => {
        connection?.query(
          userQueries.$insertAddressSQL,
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
            err ? reject(err) : resolve();
          }
        );
      });
      return res.status(200).json({ info: "Successfully added address" });
    } catch (error) {
      log(error);
      res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateUserDatas(req: Request, res: Response) {
    const { userID, email, phone, password } = req.body;

    const updatedAt = generalUtils.getFullCurrentDate();

    const hashedPassword = security.hashPassword(password);

    const updates: any[] = [];

    let connection: mysql.PoolConnection | null = null;

    if (email) {
      updates.push({ column: "email", value: email });
    }

    if (phone) {
      updates.push({ column: "phoneNumber", value: phone });
    }

    const column = updates.map((column) => `${column.column} = ?`).join(", ");
    const value = updates.map((value) => value.value);

    const $sql = `UPDATE users SET ${column}, updatedAt = ? WHERE userID = ? AND password = ?`;

    try {
      connection = await this.createConn();

      const userDataUpdate = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            $sql,
            [...value, updatedAt, userID, hashedPassword],
            (err, result) => {
              err ? reject(err) : resolve(result);
            }
          );
        }
      );

      if (userDataUpdate.changedRows == 0) {
        return res.status(401).json({ error: "Bad Datas" });
      }

      return res.status(200).json({ info: "Successfuly Changed" });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateUserAddress(req: Request, res: Response) {
    const { userID, password, addressLine, city, state, postalCode, country } =
      req.body;

    const updates: any[] = [];

    let connection: mysql.PoolConnection | null = null;

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
    const $sql = `UPDATE addresses JOIN users ON addresses.userID = users.userID SET ${column}, addresses.updatedAt = ? WHERE addresses.userID = ? AND users.password = ?`;

    try {
      connection = await this.createConn();

      const updateUserDatas = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            $sql,
            [...value, updateAt, userID, hashedPassword],
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );
      if (updateUserDatas.changedRows === 0) {
        return res.status(401).json({ error: "Bad Datas" });
      }

      return res.status(200).json({ info: "Successfully updated" });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateUsername(req: Request, res: Response) {
    const { userID, newUsername, password } = req.body;

    const updateTime = generalUtils.getFullCurrentDate();
    const hashedPassword = security.hashPassword(password);

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const updateUserDatas = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            userQueries.$updateUsernameSQL,
            [newUsername, updateTime, userID, hashedPassword],
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );
      if (updateUserDatas.changedRows === 0) {
        return res.status(401).json({ error: "Wrong Password" });
      }
      return res.status(200).json({ info: "Successfully updated" });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async changePassword(req: Request, res: Response) {
    const { userID, password, newPassword } = req.body;
    const updateTime = generalUtils.getFullCurrentDate();

    const hashedNewPassword = security.hashPassword(newPassword);
    const hashedOldPassword = security.hashPassword(password);

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const updatePasswordDatas = await new Promise<mysql.OkPacket>(
        (resolve, reject) => {
          connection?.query(
            userQueries.$changePasswordSQL,
            [hashedNewPassword, updateTime, userID, hashedOldPassword],
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          );
        }
      );
      if (updatePasswordDatas.changedRows === 0) {
        return res.status(401).json({ error: "Wrong Password" });
      }
      return res.status(200).json({ info: "Successfully changed password" });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getUserDatas(req: Request, res: Response) {
    const { userID } = req.query;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();
      const userDatas = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          userQueries.$getUserDatasByID,
          [userID],
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          }
        );
      });
      if (userDatas.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ result: userDatas });
    } catch (error) {
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getUserAddresses(req: Request, res: Response) {
    const { userID } = req.query;

    let connection: mysql.PoolConnection | null = null;

    try {
      connection = await this.createConn();

      const userAddresses = await new Promise<any[]>((resolve, reject) => {
        connection?.query(
          userQueries.$getUserAddresses,
          [userID],
          (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          }
        );
      });
      if (userAddresses.length === 0) {
        return res.status(404).json({ error: "Addresses not found" });
      }
      return res.status(200).json({ result: userAddresses });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    let connection: mysql.PoolConnection | null = null;
    try {
      connection = await this.createConn();
      const users = await new Promise<any[]>((resolve, reject) => {
        connection?.query(userQueries.$getAllUsers, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
      if (users.length === 0) {
        return res.status(404).json({ error: "Users not found" });
      }
      return res.status(200).json({ result: users });
    } catch (error) {
      log(error);
      return res.sendStatus(500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default UserServices;
