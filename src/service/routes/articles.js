'use strict';

const {
  HttpCode,
} = require(`../../constants`);

const {Router} = require(`express`);

const articlesRouter = new Router();

const ArticlesRepository = require(`../repositories/articles`);

articlesRouter
  .get(`/`, async (req, res) => {
    const response = await ArticlesRepository.getAll();
    console.log(response.data);

    if (response.isSuccess) {
      res.json(response.body);
    } else {
      res.status(HttpCode.NOT_FOUND).send(response.body.message);
    }
  })
  .post(`/`, async (req, res) => {
    const newOffer = req.body;
    const response = await ArticlesRepository.create(newOffer);

    if (response.isSuccess) {
      res.status(HttpCode.SUCCESS_POST).send(response.body);
    } else {
      res.status(HttpCode.WRONG_QUERY).send(response.body.message);
    }
  });

articlesRouter
  .get(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const response = await ArticlesRepository.getById(articleId);

    if (response.isSuccess) {
      res.json(response.body);
    } else {
      res.status(HttpCode.NOT_FOUND).send(response.body.message);
    }
  })
  .put(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const response = await ArticlesRepository.update(articleId, req.body);

    if (response.isSuccess) {
      res.status(HttpCode.SUCCESS_POST).send(response.body);
    } else {
      res.status(HttpCode.WRONG_QUERY).send(response.body.message);
    }
  })
  .delete(`/:articleId`, async (req, res) => {
    const articleId = req.params.articleId;
    const response = await ArticlesRepository.delete(articleId);

    if (response.isSuccess) {
      res.status(HttpCode.SUCCESS_DELETE).send();
    } else {
      res.status(HttpCode.NOT_FOUND).send(response.body.message);
    }
  });

articlesRouter
  .get(`/:articleId/comments`, async (req, res) => {
    const articleId = req.params.articleId;
    const response = await ArticlesRepository.getComments(articleId);

    if (response.isSuccess) {
      res.json(response.body);
    } else {
      res.status(HttpCode.NOT_FOUND).send(response.body.message);
    }
  })
  .post(`/:articleId/comments`, async (req, res) => {
    const articleId = req.params.articleId;
    const response = await ArticlesRepository.createComment(articleId, req.body);

    if (response.isSuccess) {
      res.status(HttpCode.SUCCESS_POST).send(response.body);
    } else {
      res.status(HttpCode.WRONG_QUERY).send(response.body.message);
    }
  })
  .delete(`/:articleId/comments/:commentId`, async (req, res) => {
    const {articleId, commentId} = req.params;
    const response = await ArticlesRepository.deleteComment(articleId, commentId);

    if (response.isSuccess) {
      res.status(HttpCode.SUCCESS_DELETE).send();
    } else {
      res.status(HttpCode.NOT_FOUND).send(response.body.message);
    }
  });

module.exports = articlesRouter;
