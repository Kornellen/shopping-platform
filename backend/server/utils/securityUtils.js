const crypto = require("crypto");

class SecurityUtils {
  hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
}

module.exports = SecurityUtils;
