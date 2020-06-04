'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const {getLogger, httpLoggerMiddleware} = require(`../libs/logger`);
const logger = getLogger();
const db = require(`../db`);

const {
  HttpCode,
  ExitCode
} = require(`../../constants`);

const articlesRouter = require(`../routes/articles`);
const categoriesRouter = require(`../routes/categories`);
const searchRouter = require(`../routes/search`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());

app.use(httpLoggerMiddleware);

app.use((req, res, next) => {
  logger.debug(`New request. Url: ${req.url}`);
  next();
});

app.use(`/api/articles`, articlesRouter);
app.use(`/api/categories`, categoriesRouter);
app.use(`/api/search`, searchRouter);

app.use((req, res) => {
  logger.error(`Trying to get non-existing route: ${req.url}`);
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
});

app.use((error, req, res, next) => { // @todo Если поместить throw new Error в один из обработчиков маршрута - сюда мы так и не попадаем
  logger.error(`Caught unexpected error for url: ${req.url}. Error: ${error}`);
  res.status(HttpCode.INTERNAL_ERROR).send(`Server internal error!@!@`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;
    const isSuccessBdConnect = await db.connect();

    if (!isSuccessBdConnect) {
      logger.error(`Db problem. Stop launching application...`);

      process.exit(ExitCode.FAIL);
    }
    app.listen(port, (error) => {
      if (error) {
        logger.error(chalk.green(`Can't launch server`, error));
      }

      logger.info(chalk.green(`Server launched. Listening port: ${port}`));
    });
  }
};
