const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");

colors.enabled;

const log = console.log;

const routes = require("./src/routes/index");
const logger = require("./src/config/logger");

class App {
  constructor() {
    (this.app = express()), (this.port = 5174), (this.routes = routes);
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(
      morgan("combined", {
        stream: {
          write: (message) => {
            logger.info(message.trim());
          },
        },
      })
    );
  }

  setupRoutes() {
    this.routes.forEach((route) => {
      this.app.use("/api", route);
    });
  }

  setUpPublic() {
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setUpPublic();
    this.app.listen(this.port, () => {
      log(`[server]: Started on: http://localhost:${this.port}/api`.cyan);
    });
  }
}

const server = new App();

server.start();
