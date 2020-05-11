'use strict';

const axios = require(`axios`);

const {
  BASE_API_URL
} = require(`../../constants`);

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/new-post`, {
    title: `post-page`,
    user: {
      role: `author`
    },
    comments: [],
    post: {
      image: `1`
    }
  });
});
articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles/articles-by-category`, {
    activeCategory: 3,
    categories: [
      {
        id: 1,
        title: `Автомобили`,
        count: 88
      },
      {
        id: 2,
        title: `Удаленная работа`,
        count: 13
      },
      {
        id: 3,
        title: `Бизнес`,
        count: 13
      },
      {
        id: 4,
        title: `Путешествия`,
        count: 13
      },
      {
        id: 5,
        title: `Дизайн и обустройство`,
        count: 13
      },
      {
        id: 6,
        title: `Производство игрушек`,
        count: 22
      },
      {
        id: 7,
        title: `UX & UI`,
        count: 22
      }
    ]
  });
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const response = await axios.get(`${BASE_API_URL}/articles/${req.params.id}`);
  res.render(`articles/edit-post`, {
    title: `post-page`,
    user: {},
    comments: [],
    article: response.data
  });
});
articlesRouter.get(`/:id`, (req, res) => {
  res.render(`articles/post`, {
    title: `post-page`,
    user: {},
    comments: [],
    post: {
      image: `1`
    }
  });
});

module.exports = articlesRouter;
