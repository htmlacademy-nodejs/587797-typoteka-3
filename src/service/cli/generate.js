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

const fs = require(`fs`);

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const Sentences = {
  MAX_ANNOUNCE_VALUE: 5,
  VALUES: [
    `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    `Первая большая ёлка была установлена только в 1938 году.`,
    `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    `Собрать камни бесконечности легко, если вы прирожденный герой.`,
    `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    `Программировать не настолько сложно, как об этом говорят.`,
    `Простые ежедневные упражнения помогут достичь успеха.`,
    `Это один из лучших рок-музыкантов.`,
    `Он написал больше 30 хитов.`,
    `Из под его пера вышло 8 платиновых альбомов.`,
    `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    `Достичь успеха помогут ежедневные повторения.`,
    `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    `Как начать действовать? Для начала просто соберитесь.`,
    `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
    `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
  ]
};

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const generateOffers = (offersNumber) => {
  return Array(offersNumber).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: shuffleArray(Sentences.VALUES).slice(1, Sentences.MAX_ANNOUNCE_VALUE).join(` `),
    fullText: shuffleArray(Sentences.VALUES).slice(1, Sentences.VALUES.length - 1).join(` `),
    createdDate: moment(Date.now() - getRandomInt(0, (MONTH_MILLISECONDS * 3))).format(`YYYY-MM-DD HH-mm-ss`),
    category: shuffleArray(CATEGORIES).slice(1, getRandomInt(1, CATEGORIES.length - 1))
  }));
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [offersNumberFromUser] = args;
    const offersNumber = Number(offersNumberFromUser) || DEFAULT_OFFER_NUMBER;

    if (offersNumber > MAX_MOCK_OBJECT_NUMBER) {
      console.info(chalk.green(`No more than ${MAX_MOCK_OBJECT_NUMBER} advertisements`));
      process.exit(ExitCode.SUCCESS);
    }

    fs.writeFile(MOCK_FILE_PATH, JSON.stringify(generateOffers(offersNumber)), (error) => {
      if (error) {
        console.error(chalk.red(`Can't write data to file...`));
        process.exit(ExitCode.FAIL);
      }

      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.SUCCESS);
    });
  }
};
