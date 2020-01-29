'use strict';

const chalk = require(`chalk`);
const moment = require(`moment`);

const {
  getRandomInt,
  shuffleArray
} = require(`../../utils`);

const {
  DEFAULT_OFFER_NUMBER,
  MOCK_FILE_PATH,
  MONTH_MILLISECONDS,
  ExitCode,
  MAX_MOCK_OBJECT_NUMBER
} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const fs = require(`fs`).promises;

const MAX_ANNOUNCE_VALUE = 5;

const generateOffers = (offersNumber, titles, categories, sentences) => {
  return Array(offersNumber).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffleArray(sentences).slice(1, MAX_ANNOUNCE_VALUE).join(` `),
    fullText: shuffleArray(sentences).slice(1, sentences.length - 1).join(` `),
    createdDate: moment(Date.now() - getRandomInt(0, (MONTH_MILLISECONDS * 3))).format(`YYYY-MM-DD HH-mm-ss`),
    category: shuffleArray(categories).slice(1, getRandomInt(1, categories.length - 1))
  }));
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    return content.split(`\n`);
  } catch (error) {
    console.log(chalk.red(error));

    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [offersNumberFromUser] = args;
    const offersNumber = Number(offersNumberFromUser) || DEFAULT_OFFER_NUMBER;

    if (offersNumber > MAX_MOCK_OBJECT_NUMBER) {
      console.info(chalk.green(`No more than ${MAX_MOCK_OBJECT_NUMBER} advertisements`));
      process.exit(ExitCode.SUCCESS);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    try {
      await fs.writeFile(MOCK_FILE_PATH, JSON.stringify(generateOffers(offersNumber, titles, categories, sentences)));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.FAIL);
    }

    console.info(chalk.green(`Operation success. File created`));
    process.exit(ExitCode.SUCCESS);
  }
};
