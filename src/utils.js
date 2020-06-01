'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const getRandomElement = (arr) => arr[getRandomInt(0, arr.length - 1)];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [array[randomPosition], array[i]];
  }

  return array;
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
  getRandomElement,
  getRandomInt,
  shuffleArray,
  readContent
};
