'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const moment = require(`moment`);
const {nanoid} = require(`nanoid`);
const pictures = [
  `sea@1x.webp`,
  `skyscraper@1x.webp`,
  `forest@1x.webp`
];

const {
  getRandomInt,
  shuffleArray,
  readContent
} = require(`../../utils`);

const {
  DEFAULT_OFFER_NUMBER,
  MOCK_FILE_PATH,
  MONTH_MILLISECONDS,
  ExitCode,
  MAX_MOCK_OBJECT_NUMBER,
  FilePath
} = require(`../../constants`);

const MAX_ANNOUNCE_VALUE = 5;

const generateOffers = (offersNumber, titles, categories, sentences, commentsText) => {
  return Array(offersNumber).fill({}).map(() => ({
    id: nanoid(),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffleArray(sentences).slice(1, MAX_ANNOUNCE_VALUE).join(` `),
    fullText: shuffleArray(sentences).slice(1, sentences.length - 1).join(` `),
    createdDate: moment(Date.now() - getRandomInt(0, (MONTH_MILLISECONDS * 3))).format(`YYYY-MM-DD HH-mm-ss`),
    categories: shuffleArray(categories).slice(0, getRandomInt(1, 3)),
    comments: generateComments(getRandomInt(1, 5), commentsText),
    picture: pictures[getRandomInt(0, pictures.length - 1)]
  }));
};

const generateComments = (count, commentsText) => {
  return Array(count).fill({}).map(() => {
    // console.log(count, commentsText);
    return {
      id: nanoid(),
      text: shuffleArray(commentsText).slice(1, count).join(` `)
    };
  });
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

    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const sentences = await readContent(FilePath.SENTENCES);
    let commentsText = await readContent(FilePath.COMMENTS_TEXT);
    commentsText = commentsText.filter((text) => text.length > 0);

    try {
      await fs.writeFile(MOCK_FILE_PATH, JSON.stringify(generateOffers(offersNumber, titles, categories, sentences, commentsText)));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.FAIL);
    }

    console.info(chalk.green(`Operation success. File created`));
    process.exit(ExitCode.SUCCESS);
  }
};
