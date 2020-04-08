'use strict';

const express = require(`express`);

const articlesRouter = require(`./routes/articles`);
const myRouter = require(`./routes/my`);

const PORT = 8080;

const app = express();

app.use(express.static(`markup`));

app.set(`views`, __dirname + `/templates`);
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRouter);
app.use(`/my`, myRouter);

app.get(`/`, (req, res) => {
  res.render(`main`, {
    user: {
      role: `author`
    },
    mostCommented: [],
    lastComments: [],
    articles: []
  });
});
app.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});
app.get(`/login`, (req, res) => {
  res.render(`login`);
});
app.get(`/search`, (req, res) => {
  res.render(`search`, {
    user: {
      role: `author`
    }
  });
});
app.get(`/categories`, (req, res) => {
  res.render(`all-categories`, {
    user: {
      role: `author`
    },
    categories: [
      {
        id: 1,
        title: `Жизнь и путешествия`
      },
      {
        id: 2,
        title: `Путешествия`
      },
      {
        id: 3,
        title: `Дизайн и программирование`
      },
      {
        id: 4,
        title: `Другое`
      },
      {
        id: 5,
        title: `Личное`
      }
    ]
  });
});

app.listen(PORT);

app.use((req, res, next) => {
  res
    .status(404)
    .render(`errors/400`, {
      errorCode: 404
    });

  next();
});

app.use((err, req, res, next) => {
  res
    .status(500)
    .render(`errors/500`, {
      errorCode: 500
    });

  next();
});
