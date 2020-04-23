'use strict';

jest.mock(`../repositories/categories`);

const {
  HttpCode,
  ContentTypeRegExp
} = require(`../../constants`);

const request = require(`supertest`);
const express = require(`express`);

const app = express();

app.use(express.json());
app.use(`/`, require(`./categories`));

const CategoriesRepository = require(`../repositories/categories`);

describe(`test GET api/categories/ route`, () => {
  test(`test success answer`, async () => {
    const getAllMethodResponse = {
      isSuccess: true,
      body: [1, 2, 3]
    };

    CategoriesRepository.getAll.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/`);

    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(getAllMethodResponse.body);
  });

  test(`test wrong response`, async () => {
    const getAllMethodResponse = {
      isSuccess: false,
      body: {
        message: `Not found any categories`
      }
    };

    CategoriesRepository.getAll.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/`);

    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(getAllMethodResponse.body.message);
  });
});
