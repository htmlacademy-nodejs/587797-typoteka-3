'use strict';

const packageJsonFile = require(`../../../package`);

module.exports = {
  name: `--version`,
  run() {
    console.info(packageJsonFile.version);
  }
};
