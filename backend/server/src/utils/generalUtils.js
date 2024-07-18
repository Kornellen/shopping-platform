const nodemailer = require("nodemailer");
const email = require("../config/email");
const fs = require("fs");
const handleBars = require("handlebars");

class GeneralUtils {
  getFullCurrentDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const secunds = date.getSeconds();

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

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }

  log(msg) {
    return console.log(msg);
  }

  capitalizeFirstLetter(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  generateDynamicUpdateQuery(table, update) {
    const updateColumn = update
      .map((update) => `${update.column} = ?`)
      .join(",");

    const $updateProductSQL = `UPDATE ${table} SET ${updateColumn}, updatedAt = ? WHERE productID = ? `;

    return $updateProductSQL;
  }

  sendEmails(to, requestID) {
    fs.readFile(
      "src/views/retrunrequest.html",
      "utf8",
      (err, returnTemplate) => {
        if (err) {
          this.log(err);
        } else {
          const template = handleBars.compile(returnTemplate);
          const transporter = nodemailer.createTransport(email);

          const fullTemplate = template({ requestID });

          let mailOptions = {
            from: `Shopping platform <${email.auth.user}>`,
            to: to,
            subject: "Retrun request",
            html: fullTemplate,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              this.log(err);
            }
          });
        }
      }
    );
  }
}

module.exports = GeneralUtils;
