'use strict';

const path = require(`path`);
const express = require(`express`);
const {getLogger, httpLoggerMiddleware} = require(`./libs/logger`);
const logger = getLogger();

const mainRouter = require(`./routes/main`);
const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);

const PORT = 8080;
const {HttpCode} = require(`../constants`);
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.json());
app.use(express.text());

app.use(httpLoggerMiddleware);
app.use((req, res, next) => {
  logger.info(`Incoming request ${req.originalUrl}`);
  next();
});

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);

app.use((req, res, next) => {
  logger.error(`404 middleware. Not found`);

  res.status(HttpCode.NOT_FOUND).render(`errors/400`, {
    errorCode: HttpCode.NOT_FOUND
  });
});

app.use((error, req, res, next) => {
  logger.error(`Internal error. ${error}`);

  res.status(HttpCode.INTERNAL_ERROR).render(`errors/500`, {
    errorCode: HttpCode.INTERNAL_ERROR
  });
});

app.listen(PORT, (error) => {
  if (error) {
    logger.error(`Can't launch server: ${error}`);
    return;
  }

  logger.info(`Server launched. Listening port: ${PORT}`);
});
