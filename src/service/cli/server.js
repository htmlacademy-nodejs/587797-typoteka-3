'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const {getLogger} = require(`../../libs/logger`);
const logger = getLogger();

const {
  HttpCode,
} = require(`../../constants`);

const articlesRouter = require(`../routes/articles`);
const categoriesRouter = require(`../routes/categories`);
const searchRouter = require(`../routes/search`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  logger.debug(`New request. Url: ${req.url}`);
  const onResponseFinish = () => {
    logger.info(`Request finished with code: ${res.statusCode}`);
    logger.info(`All response info: ${res.toString()}`); // как распечатать объект, чтобы не было All response info: [object Object]
    res.removeListener(`finish`, onResponseFinish);
  };
  res.on(`finish`, onResponseFinish);
  next();
});

app.use(`/api/articles`, articlesRouter);
app.use(`/api/categories`, categoriesRouter);
app.use(`/api/search`, searchRouter);

app.use((req, res) => {
  logger.error(`Trying to get non-existing route: ${req.url}`);
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
});

app.use((error, req, res, next) => { // Если поместить throw new Error в один из обработчиков маршрута - сюда мы так и не попадаем
  logger.error(`Caught unexpected error for url: ${req.url}. Error: ${error}`);
  res.status(HttpCode.INTERNAL_ERROR).send(`Server internal error!@!@`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;

    app.listen(port, (error) => {
      if (error) {
        logger.error(chalk.green(`Can't launch server`, error));
      }

      logger.info(chalk.green(`Server launched. Listening port: ${port}`));
    });
  }
};
