'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {
  MOCK_FILE_PATH
} = require(`../../constants`);

let articlesData = [];
let isCalled = false;

class Articles {
  constructor() {
    this._requiredArticlesFields = [`title`, `announce`, `created`];
    this._commentRequiredFields = [`text`];
  }

  get _articlesData() {
    return (async function () {
      if (articlesData.length === 0 && !isCalled) {
        try {
          articlesData = await fs.readFile(MOCK_FILE_PATH, `utf8`);
          articlesData = JSON.parse(articlesData);
          isCalled = true;
        } catch (error) {
          console.error(chalk.red(error));
        }
      }

      return articlesData;
    })();
  }

  async getById(articleId) {
    const articles = await this._articlesData;
    const foundArticle = articles.find((article) => article.id === articleId);

    if (foundArticle === undefined) {
      return {
        isSuccess: false,
        body: {
          message: `There is no such offer with id #${articleId}`
        }
      };
    } else {
      return {
        isSuccess: true,
        body: foundArticle
      };
    }
  }

  async getAll() {
    const articles = await this._articlesData;

    if (articles.length === 0) {
      return {
        isSuccess: false,
        body: {
          message: `Not found any articles`
        }
      };
    } else {
      return {
        isSuccess: true,
        body: articles
      };
    }
  }

  async delete(articleId) {
    const articles = await this._articlesData;
    const response = await this.getById(articleId);

    if (!response.isSuccess) {
      return response;
    } else {
      articlesData = articles.filter((article) => article.id !== articleId);

      return {
        isSuccess: true,
        body: null
      };
    }
  }

  async create(data) {
    const formField = Object.keys(data);

    if (!this._isValidArticlePostData(data)) {
      return {
        isSuccess: false,
        body: {
          message: `Invalid form: ${formField}`
        }
      };
    } else {
      const newArticle = Object.assign({}, {
        id: nanoid(),
        comments: []
      }, data);

      const result = await this._articlesData;

      result.push(newArticle);

      return {
        isSuccess: true,
        body: newArticle
      };
    }
  }

  async update(articleId, data) {
    const formField = Object.keys(data);

    if (!this._isValidArticlePutData(data)) {
      return {
        isSuccess: false,
        body: {
          message: `Invalid form: ${formField}`
        }
      };
    }

    const getResponse = await this.getById(articleId);

    if (!getResponse.isSuccess) {
      return getResponse;
    }

    const deleteResponse = await this.delete(articleId);

    if (!deleteResponse.isSuccess) {
      return deleteResponse;
    }

    const updatedArticle = Object.assign({}, getResponse.body, data);
    articlesData.push(updatedArticle);

    return {
      isSuccess: true,
      body: updatedArticle
    };
  }

  async getComments(articleId) {
    const response = await this.getById(articleId);

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      body: response.body.comments
    };
  }

  async deleteComment(articleId, commentId) {
    const response = await this.getById(articleId);

    if (!response.isSuccess) {
      return response;
    }

    const article = response.body;
    const comments = article.comments;

    if (comments.length === 0) {
      return {
        isSuccess: false,
        body: {
          message: `There is no comments yet`
        }
      };
    }

    const foundComment = comments.find((comment) => comment.id === commentId);

    if (foundComment === undefined) {
      return {
        isSuccess: false,
        body: {
          message: `There is no comment with id #${commentId}`
        }
      };
    }

    article.comments = comments.filter((comment) => comment.id !== commentId);

    return {
      isSuccess: true,
      body: null
    };
  }

  async createComment(offerId, data) {
    const fieldsKeys = Object.keys(data);

    if (!this._isValidCommentPostData(data)) {
      return {
        isSuccess: false,
        body: {
          message: `Invalid form: ${fieldsKeys}`
        }
      };
    }

    const getResponse = await this.getById(offerId);

    if (!getResponse.isSuccess) {
      return getResponse;
    }

    const article = getResponse.body;
    const newComment = Object.assign({}, {id: nanoid()}, data);

    article.comments.push(newComment);

    return {
      isSuccess: true,
      body: newComment
    };
  }

  async searchByTitle(query) {
    const articles = await this._articlesData;

    const foundOffers = articles.filter((article) => article.title.indexOf(query) !== -1);

    return {
      isSuccess: true,
      body: foundOffers
    };
  }

  _isValidArticlePostData(data) {
    const formField = Object.keys(data);

    return this._requiredArticlesFields.every((requiredField) => formField.includes(requiredField));
  }

  _isValidArticlePutData(data) {
    const formFields = Object.keys(data);

    return formFields.every((formField) => this._requiredArticlesFields.includes(formField));
  }

  _isValidCommentPostData(data) {
    const formFields = Object.keys(data);

    return this._commentRequiredFields.every((requiredField) => formFields.includes(requiredField));
  }
}

module.exports = new Articles();
