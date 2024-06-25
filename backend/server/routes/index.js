const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/ordersRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const routes = [
  userRoutes,
  cartRoutes,
  productRoutes,
  orderRoutes,
  reviewRoutes,
  wishlistRoutes,
];

module.exports = routes;
