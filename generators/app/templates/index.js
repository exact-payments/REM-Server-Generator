var pkg      = require('./package');
var config   = require('./config');
var logger   = require('./logger');
var <%= serverClassName %> = require('./lib/<%= serverName %>');


try {
  pkg.revision = readFileSync(require.resolve('../REVISION'));
} catch (e) {}


exports = module.exports = new <%= serverClassName %>(config, logger);
exports.<%= serverClassName %> = <%= serverClassName %>;
