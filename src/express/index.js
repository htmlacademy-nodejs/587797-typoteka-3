'use strict';

const path = require(`path`);
const express = require(`express`);

const mainRouter = require(`./routes/main`);
const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);

const PORT = 8080;
const {HttpCode} = require(`../constants`);
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);

app.listen(PORT);

app.use((req, res, next) => {
  res
    .status(HttpCode.NOT_FOUND)
    .render(`errors/400`, {
      errorCode: HttpCode.NOT_FOUND
    });

  next();
});

app.use((err, req, res, next) => {
  res
    .status(HttpCode.INTERNAL_ERROR)
    .render(`errors/500`, {
      errorCode: HttpCode.INTERNAL_ERROR
    });

  next();
});
