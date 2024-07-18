import { config } from "dotenv";

config();

type database = {
  host: string;
  user: string;
  password: string;
  database: string;
};

const database = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: "shopping_platform",
};

export default database;
