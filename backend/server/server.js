const express = require("express");
const cors = require("cors");
const log = console.log;

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/ordersRoutes");

const routes = [userRoutes, cartRoutes, productRoutes, orderRoutes];

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
