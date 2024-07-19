export default {
  $createUserSQL:
    "INSERT INTO users(username, email, password, firstName, lastName, phoneNumber, birthdate, gender, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)",
  $createCartSQL:
    "INSERT INTO cart(userID, createdAt, updatedAt) VALUES (?, ?, ?)",
  $createWishlistSQL: "INSERT INTO wishlists(userID, createdAt) VALUES (?,?)",
  $findUserByUsernameSQL:
    "SELECT password, users.userID FROM users where username = ?",
  $insertAddressSQL:
    "INSERT INTO addresses (userID, addressLine, city, state, postalCode, country, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)",
  $updateUsernameSQL:
    "UPDATE users SET username = ?, updatedAt = ? where userID = ? and password = ?",
  $changePasswordSQL:
    "UPDATE users set password = ?, updatedAt = ? where userID = ? and password = ?",
  $getUserDatasByID:
    "SELECT users.username, users.email, users.firstName, users.lastName, users.phoneNumber, users.createdAt, roles.role FROM Users JOIN roles ON users.role = roles.roleID WHERE userID = ?",
  $getUserAddresses: "SELECT * FROM Addresses WHERE userID = ?",
  $getAllUsers:
    "SELECT users.*, roles.role FROM Users JOIN roles ON users.role = roles.roleID",
};
