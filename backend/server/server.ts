import cors from "cors";
import colors from "colors";
import express, { Express } from "express";
import morgan from "morgan";
import path from "path";
import { log } from "console";

colors.enabled;

import logger from "./src/config/logger";
import routes from "./src/routes";
class App {
  private app: Express;
  private port: number;
  private routes: any[];

  constructor() {
    this.app = express();
    this.port = 5174;
    this.routes = routes;
  }

  setUpMiddleware() {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(
      morgan("combined", {
        stream: { write: (message) => logger.info(message) },
      })
    );
    this.app.use(express.json());
  }

  setUpRoutes() {
    this.routes.forEach((route) => this.app.use("/api", route));
  }

  setUpPublic() {
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  start() {
    try {
      this.setUpMiddleware();
      this.setUpRoutes();
      this.app.listen(this.port, () => {
        log(`[server]: Started on: http://localhost:${this.port}/api`.cyan);
      });
    } catch (error) {
      log(error);
    }
  }
}

const server = new App();

server.start();
