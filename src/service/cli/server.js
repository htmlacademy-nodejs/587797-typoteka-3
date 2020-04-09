'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`).promises;
const {
  MOCK_FILE_PATH,
  HttpCode,
  ErrorCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());

    app.get(`/posts`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(MOCK_FILE_PATH);

        res.send(JSON.parse(fileContent));
      } catch (error) {
        if (error.code === ErrorCode.NO_FILE_OR_DIRECTORY) {
          res.statusCode(HttpCode.NOT_FOUND).send(`There is no data file`);
        } else {
          res.statusCode(HttpCode.INTERNAL_ERROR).send(`Internal error`);
        }

        console.info(chalk.red(error));
      }
    });

    app.listen(port, () => {
      return console.info(chalk.green(`Ожидаю соединений на порт ${port}`));
    });

    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));
  }
};
