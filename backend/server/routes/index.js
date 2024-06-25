const userRoutes = require("./userRoutes");
const cartRoutes = require("./cartRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./ordersRoutes");
const reviewRoutes = require("./reviewRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const returnRoutes = require("./retrunRequestsRoutes");

const routes = [
  userRoutes,
  cartRoutes,
  productRoutes,
  orderRoutes,
  reviewRoutes,
  wishlistRoutes,
  returnRoutes,
];

module.exports = routes;
