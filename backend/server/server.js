const express = require("express");
const cors = require("cors");
const log = console.log;

const routes = require("./routes/index");

class App {
  constructor() {
    (this.app = express()), (this.port = 5174), (this.routes = routes);
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  setupRoutes() {
    this.routes.forEach((route) => {
      this.app.use("/api", route);
    });
  }

  start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.app.listen(this.port, () => {
      log(`App Started on port: ${this.port}`);
    });
  }
}

const server = new App();

server.start();
