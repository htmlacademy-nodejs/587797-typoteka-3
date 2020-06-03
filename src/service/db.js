'use strict';

require(`dotenv`).config();
const {Sequelize} = require(`sequelize`);
const {getLogger} = require(`./libs/logger`);
const logger = getLogger();

module.exports = {
  async connect() {
    const {
      DB_NAME,
      DB_USERNAME,
      DB_PASSWORD,
      DB_HOST,
      DB_DIALECT
    } = process.env;

    const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
      host: DB_HOST,
      dialect: DB_DIALECT
    });

    try {
      logger.info(`Start connecting to database...`);
      await sequelize.authenticate();
      logger.info(`Successfully connected to database`);

      return true;
    } catch (err) {
      logger.error(`Can't connect to database: ${err}`);

      return false;
    }
  }
};
