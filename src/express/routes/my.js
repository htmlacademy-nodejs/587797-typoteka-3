'use strict';

const {Router} = require(`express`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => {
  res.render(`my/my`, {
    user: {
      role: `author`
    }
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
