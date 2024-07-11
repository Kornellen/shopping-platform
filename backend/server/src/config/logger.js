const path = require("path");
const winston = require("winston");
const morgan = require("morgan");
const { combine, timestamp, json } = winston.format;

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/server-error.log"),
      level: "error",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/server-info.log"),
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
});

module.exports = logger;
