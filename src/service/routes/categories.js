'use strict';

const CategoriesRepository = require(`../repositories/categoriesRepository`);

const {
  HttpCode,
} = require(`../../constants`);

const {Router} = require(`express`);
const categoriesRouter = new Router();

categoriesRouter.get(`/`, async (req, res) => {
  const response = await CategoriesRepository.getAll();

  if (response.isSuccess) {
    res.json(response.body);
  } else {
    res.status(HttpCode.NOT_FOUND).send(response.body.message);
  }
});

module.exports = categoriesRouter;
