'use strict';

jest.mock(`../repositories/articles`);

const {
  HttpCode,
  ContentTypeRegExp
} = require(`../../constants`);

const request = require(`supertest`);
const express = require(`express`);

const app = express();

app.use(express.json());
app.use(`/`, require(`./search`));

const CategoriesRepository = require(`../repositories/articles`);

describe(`test GET api/search/ route`, () => {
  test(`test successfully found entities`, async () => {
    const queryParam = `somethingToSearch`;
    const getAllMethodResponse = {
      isSuccess: true,
      body: [
        {id: `test id 1`},
        {id: `test id 2`}
      ]
    };

    CategoriesRepository.searchByTitle.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/?query=${queryParam}`);

    expect(CategoriesRepository.searchByTitle.mock.calls[0][0]).toStrictEqual(queryParam);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.JSON);
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toStrictEqual(getAllMethodResponse.body);
  });

  test(`test not found entities. 404 response`, async () => {
    const queryParam = `somethingToSearch`;
    const getAllMethodResponse = {
      isSuccess: false,
      body: {
        message: `Wrong`
      }
    };

    CategoriesRepository.searchByTitle.mockReturnValue(getAllMethodResponse);

    const response = await request(app).get(`/?query=${queryParam}`);

    expect(CategoriesRepository.searchByTitle.mock.calls[0][0]).toStrictEqual(queryParam);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(getAllMethodResponse.body.message);
  });

  test(`test no query param. 404 response`, async () => {
    const queryParam = ``;
    CategoriesRepository.searchByTitle.mock.calls = [];

    const response = await request(app).get(`/?query=${queryParam}`);

    expect(CategoriesRepository.searchByTitle.mock.calls).toEqual([]);
    expect(response.headers[`content-type`]).toMatch(ContentTypeRegExp.HTML);
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(response.text).toBe(`There is no search param`);
  });
});
