'use strict';

const axios = require(`axios`);
const moment = require(`moment`);

const {
  BASE_API_URL
} = require(`../../constants`);

const {Router} = require(`express`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const response = await axios.get(`${BASE_API_URL}/articles/`);

  res.render(`my/my`, {
    user: {
      role: `author`
    },
    articles: response.data,
    moment
  });
});
myRouter.get(`/comments`, (req, res) => {
  res.render(`my/comments`, {
    user: {
      role: `author`
    }
  });
});

module.exports = myRouter;
