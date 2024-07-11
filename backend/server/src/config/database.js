require("dotenv").config();

const database = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: "shopping_platform",
};

module.exports = database;
