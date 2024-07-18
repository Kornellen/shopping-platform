const path = require("path");

import { createLogger, format, transports } from "winston";

const { combine, timestamp, json } = format;

const errorFilter = format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = format((info, opts) => {
  return info.level === "info" ? info : false;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/server-error.log"),
      level: "error",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new transports.File({
      filename: path.join(__dirname, "../logs/server-info.log"),
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
});

export default logger;
