'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => {
  res.render(`main/main`, {
    user: {
      role: `author`
    },
    mostCommented: [],
    lastComments: [],
    articles: []
  });
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`main/sign-up`);
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`main/login`);
});

mainRouter.get(`/search`, (req, res) => {
  res.render(`main/search`, {
    user: {
      role: `author`
    }
  });
});

mainRouter.get(`/categories`, (req, res) => {
  res.render(`main/all-categories`, {
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

module.exports = mainRouter;