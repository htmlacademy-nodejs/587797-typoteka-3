'use strict';

const path = require(`path`);
const pino = require(`pino`);

const logger = pino({
  name: `pino-and-express`,
  level: process.env.LOG_LEVEL || `info`,
}, path.resolve(__dirname, `../../service/logs/app.txt`));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
