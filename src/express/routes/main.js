'use strict';

const axios = require(`axios`);
const moment = require(`moment`);

const {
  BASE_API_URL
} = require(`../../constants`);

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/articles/`);

    res.render(`main/main`, {
      user: {
        role: `author`
      },
      mostCommented: [],
      lastComments: [],
      articles: response.data,
      moment
    });
  } catch (error) {
    next(error);
  }
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`main/sign-up`);
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`main/login`);
});

mainRouter.get(`/search`, async (req, res) => {
  const searchingText = (req.query.search || ``).trim();
  let articles = [];
  if (searchingText.length > 0) {
    const response = await axios.get(`${BASE_API_URL}/search/?query=${encodeURI(searchingText)}`);
    articles = response.data;
  }

  res.render(`main/search`, {
    user: {
      role: `author`
    },
    search: searchingText || ``,
    articles,
    moment
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
