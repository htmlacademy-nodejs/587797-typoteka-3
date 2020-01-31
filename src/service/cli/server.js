'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {
  MOCK_FILE_PATH,
  HttpCode,
  ErrorCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;
  const internalErrorMessageText = `Internal error`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(MOCK_FILE_PATH);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);

        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (error) {
        if (error.code === ErrorCode.NO_FILE_OR_DIRECTORY) {
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
        } else {
          sendResponse(res, HttpCode.INTERNAL_ERROR, internalErrorMessageText);
        }
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);

      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (error) => {
        if (error) {
          return console.error(chalk.red(`Ошибка при создании сервера: ${error}`));
        }

        return console.info(chalk.green(`Ожидаю соединений на порт ${port}`));
      });
  }
};
