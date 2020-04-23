'use strict';

jest.mock(`../repositories/articles`);
// @todo Если тесты падают - процесс не останавливается, то есть тесты сразу не завершаются. Может это из-за асинхронности?
const {
  HttpCode,
  ContentTypeRegExp
} = require(`../../constants`);

const request = require(`supertest`);
const express = require(`express`);

const app = express();

app.use(express.json());
app.use(`/`, require(`./articles`));

const ArticlesRepository = require(`../repositories/articles`);

describe(`test GET api/articles/ route`, () => {
  test(`test success answer`, async () => {
    const getAllMethodResponse = {
      isSuccess: true,
      body: [1, 2, 3]
    };

    ArticlesRepository.getAll.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/`);

    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(getAllMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const getAllMethodResponse = {
      isSuccess: false,
      body: {
        message: `Not found any articles`
      }
    };

    ArticlesRepository.getAll.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/`);

    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(getAllMethodResponse.body.message);
  });
});

describe(`test POST api/articles/ route`, () => {
  test(`test success answer`, async () => {
    const postData = {
      id: `test id`,
      title: `test title`
    };

    const createMethodResponse = {
      isSuccess: true,
      body: {
        id: `test title 2`,
        title: `test title 2`
      }
    };

    ArticlesRepository.create.mockReturnValue(createMethodResponse);

    const response = await request(app).post(`/`).send(postData);

    expect(ArticlesRepository.create.mock.calls[0][0]).toStrictEqual(postData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.SUCCESS_POST);
    expect(response.body).toStrictEqual(createMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const postData = {
      id: `test id`,
      title: `test title`
    };
    const createMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.create.mockReturnValue(createMethodResponse);

    const response = await request(app).post(`/`).send(postData);

    expect(ArticlesRepository.create.mock.calls[0][0]).toStrictEqual(postData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.WRONG_QUERY);
    expect(response.text).toStrictEqual(createMethodResponse.body.message);
  });
});

describe(`test GET api/articles/:articleId route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;

    const getByIdMethodResponse = {
      isSuccess: true,
      body: {
        id: `test id`
      }
    };

    ArticlesRepository.getById.mockReturnValue(getByIdMethodResponse);

    const response = await request(app).get(`/${articleId}`);

    expect(ArticlesRepository.getById.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(getByIdMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;

    const getByIdMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.getById.mockReturnValue(getByIdMethodResponse);

    const response = await request(app).get(`/${articleId}`);

    expect(ArticlesRepository.getById.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(getByIdMethodResponse.body.message);
  });
});

describe(`test PUT api/articles/:articleId route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;
    const putData = {
      title: `test title`
    };
    const updateMethodResponse = {
      isSuccess: true,
      body: {
        id: `test id`
      }
    };

    ArticlesRepository.update.mockReturnValue(updateMethodResponse);

    const response = await request(app).put(`/${articleId}`).send(putData);

    expect(ArticlesRepository.update.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.update.mock.calls[0][1]).toStrictEqual(putData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.SUCCESS_POST);
    expect(response.body).toStrictEqual(updateMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;
    const putData = {
      title: `test title`
    };
    const updateMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.update.mockReturnValue(updateMethodResponse);

    const response = await request(app).put(`/${articleId}`).send(putData);

    expect(ArticlesRepository.update.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.update.mock.calls[0][1]).toStrictEqual(putData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.WRONG_QUERY);
    expect(response.text).toBe(updateMethodResponse.body.message);
  });
});

describe(`test DELETE api/articles/:articleId route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;
    const deleteMethodResponse = {
      isSuccess: true,
    };

    ArticlesRepository.delete.mockReturnValue(deleteMethodResponse);

    const response = await request(app).delete(`/${articleId}`);

    expect(ArticlesRepository.delete.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.statusCode).toBe(HttpCode.SUCCESS_DELETE);
    expect(response.body).toStrictEqual({});
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;
    const deleteMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.delete.mockReturnValue(deleteMethodResponse);

    const response = await request(app).delete(`/${articleId}`);

    expect(ArticlesRepository.delete.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(deleteMethodResponse.body.message);
  });
});

describe(`test GET api/articles/:articleId/comments route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;
    const getCommentsMethodResponse = {
      isSuccess: true,
      body: [
        {
          id: `test id 1`
        },
        {
          id: `test id 2`
        }
      ]
    };

    ArticlesRepository.getComments.mockReturnValue(getCommentsMethodResponse);

    const response = await request(app).get(`/${articleId}/comments`);

    expect(ArticlesRepository.getComments.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(getCommentsMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;
    const getCommentsMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.getComments.mockReturnValue(getCommentsMethodResponse);

    const response = await request(app).get(`/${articleId}/comments`);

    expect(ArticlesRepository.getComments.mock.calls[0][0]).toStrictEqual(articleId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(getCommentsMethodResponse.body.message);
  });
});

describe(`test POST api/articles/:articleId/comments route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;
    const postData = {
      id: `test id`,
      title: `test title`
    };

    const createCommentMethodResponse = {
      isSuccess: true,
      body: {
        id: `test title 2`,
        title: `test title 2`
      }
    };

    ArticlesRepository.createComment.mockReturnValue(createCommentMethodResponse);

    const response = await request(app).post(`/${articleId}/comments`).send(postData);

    expect(ArticlesRepository.createComment.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.createComment.mock.calls[0][1]).toStrictEqual(postData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.SUCCESS_POST);
    expect(response.body).toStrictEqual(createCommentMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;
    const postData = {
      id: `test id`,
      title: `test title`
    };

    const createCommentMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.createComment.mockReturnValue(createCommentMethodResponse);

    const response = await request(app).post(`/${articleId}/comments`).send(postData);

    expect(ArticlesRepository.createComment.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.createComment.mock.calls[0][1]).toStrictEqual(postData);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.WRONG_QUERY);
    expect(response.text).toStrictEqual(createCommentMethodResponse.body.message);
  });
});

describe(`test DELETE api/articles/:articleId/comments/:commentId route`, () => {
  test(`test success answer`, async () => {
    const articleId = `articleId`;
    const commentId = `commentId`;

    const deleteCommentMethodResponse = {
      isSuccess: true
    };

    ArticlesRepository.deleteComment.mockReturnValue(deleteCommentMethodResponse);

    const response = await request(app).delete(`/${articleId}/comments/${commentId}`);

    expect(ArticlesRepository.deleteComment.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.deleteComment.mock.calls[0][1]).toStrictEqual(commentId);
    expect(response.statusCode).toBe(HttpCode.SUCCESS_DELETE);
    expect(response.body).toStrictEqual({});
  });

  test(`test wrong response`, async () => {
    const articleId = `articleId`;
    const commentId = `commentId`;

    const deleteCommentMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    ArticlesRepository.deleteComment.mockReturnValue(deleteCommentMethodResponse);

    const response = await request(app).delete(`/${articleId}/comments/${commentId}`);

    expect(ArticlesRepository.deleteComment.mock.calls[0][0]).toStrictEqual(articleId);
    expect(ArticlesRepository.deleteComment.mock.calls[0][1]).toStrictEqual(commentId);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(deleteCommentMethodResponse.body.message);
  });
});
