const express = require("express");
const cors = require("cors");
const log = console.log;

const userRoutes = require("./routes/userRoutes");

const routes = [userRoutes];

const $PORT = 5174;

const app = express();

app.use(express.json());

app.use(cors());

routes.forEach((element) => {
  app.use("/api", element);
});

app.listen($PORT, async () => {
  log("APP Started");
});
