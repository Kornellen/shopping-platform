const email = require("../config/email");
import { compile } from "handlebars";
import { createTransport } from "nodemailer";
import fs from "fs";
import { log } from "console";

class GeneralUtils {
  getFullCurrentDate() {
    const date = new Date();

    let day: number | string = date.getDate();
    let month: number | string = date.getMonth() + 1;
    const year: number = date.getFullYear();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const secunds: number = date.getSeconds();

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${secunds}`;
  }

  getOnlyDate() {
    const date = new Date();

    let day: number | string = date.getDate();
    let month: number | string = date.getMonth() + 1;
    let year: number = date.getFullYear();

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }

  capitalizeFirstLetter(str: string) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  generateDynamicUpdateQuery(table: string, update: any[]) {
    const updateColumn = update
      .map((update) => `${update.column} = ?`)
      .join(",");

    const $updateProductSQL = `UPDATE ${table} SET ${updateColumn}, updatedAt = ? WHERE productID = ? `;

    return $updateProductSQL;
  }

  sendEmails(to: string, requestID: number) {
    fs.readFile(
      "src/views/retrunrequest.html",
      "utf8",
      (err, returnTemplate) => {
        if (err) {
          log(err);
        } else {
          const template = compile(returnTemplate);
          const transporter = createTransport(email);

          const fullTemplate = template({ requestID });

          let mailOptions = {
            from: `Shopping platform <${email.auth.user}>`,
            to: to,
            subject: "Retrun request",
            html: fullTemplate,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              log(err);
            }
          });
        }
      }
    );
  }
}

module.exports = GeneralUtils;
