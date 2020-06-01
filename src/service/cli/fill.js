'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const EntitiesDTO = require(`./fill/entitiesDTO`);
const EntitiesCreator = require(`./fill/creator`);
const QueriesGenerator = require(`./fill/generator`);

const DEFAULT_OFFERS_NUMBER = 5;

module.exports = {
  name: `--fill`,
  async run(args) {
    try {
      const [offersNumberArg] = args;
      const offersNumber = Number(offersNumberArg) || DEFAULT_OFFERS_NUMBER;

      if (offersNumber < DEFAULT_OFFERS_NUMBER) {
        return console.error(chalk.red(`Bad offers count`));
      }

      const entitiesDTO = new EntitiesDTO();
      const queriesCreator = await EntitiesCreator.getCreator(offersNumber);
      queriesCreator.fillEntitiesDTO(entitiesDTO);

      await fs.writeFile(`./fill-db.sql`, new QueriesGenerator(entitiesDTO).generateSQL().getBuiltResult());
    } catch (error) {
      return console.error(chalk.red(`fill-db error: ${error}`));
    }

    return console.info(chalk.green(`File successfully generated`));
  }
};
