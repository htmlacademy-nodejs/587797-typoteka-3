'use strict';

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);
const fillDb = require(`./fill`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [generate.name]: generate,
  [server.name]: server,
  [fillDb.name]: fillDb
};

module.exports = {
  Cli
};
