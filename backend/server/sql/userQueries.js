module.exports = {
  $createUserSQL:
    "INSERT INTO users(username, email, password, firstName, lastName, phoneNumber, birthdate, gender, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)",
  $createCartSQL:
    "INSERT INTO cart(userID, createdAt, updatedAt) VALUES (?, ?, ?)",
  $createWishlistSQL: "INSERT INTO wishlists(userID, createdAt) VALUES (?,?)",
  $findUserByUsernameSQL:
    "SELECT password, userID FROM users where username = ?",
  $insertAddressSQL: "INSERT INTO addresses VALUES (?,?,?,?,?,?,?,?,?)",
  $updateUsernameSQL:
    "UPDATE users SET username = ?, updatedAt = ? where userID = ? and password = ?",
  $changePasswordSQL:
    "UPDATE users set password = ?, updatedAt = ? where userID = ? and password = ?",
  $getUsernameByID: "SELECT * FROM Users WHERE userID = ?",
};
