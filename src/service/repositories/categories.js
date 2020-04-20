'use strict';

const chalk = require(`chalk`);

const {
  FilePath
} = require(`../../constants`);

const {
  readContent
} = require(`../../utils`);

let categories = [];
let isCalled = false;

class Categories {
  get _categories() {
    return (async function () {
      if (categories.length === 0 && !isCalled) {
        try {
          categories = await readContent(FilePath.CATEGORIES);
        } catch (error) {
          console.error(chalk.red(error));
        }
      }

      return categories;
    })();
  }

  async getAll() {
    const result = await this._categories;
    if (result.length === 0) {
      return {
        isSuccess: false,
        body: {
          message: `Not found any categories`
        }
      };
    } else {
      return {
        isSuccess: true,
        body: result
      };
    }
  }
}

module.exports = new Categories();
