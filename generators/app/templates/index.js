const config = require('./config');
const logger = require('./logger');
const <%= serverClassName %> = require('./lib/<%= serverName %>');


exports = module.exports = new <%= serverClassName %>(config, logger);
exports.<%= serverClassName %> = <%= serverClassName %>;
