var milieu = require('milieu');


var config = milieu('<%= serverConfigName %>', {
  server: {
    url            : 'http://localhost:8000',
    maxResultsLimit: 1000
  },
  user: {
    passwordTtl          : 1000 * 60 * 60 * 24 * 90, // 90 days
    passwordResetTokenTtl: 1000 * 60 * 60 * 24 * 90, // 90 days
    verificationTokenTtl : 1000 * 60 * 60 * 24 * 90  // 90 days
  },
  mongo: {
    url: 'mongodb://localhost/<%= databaseName %>'
  },
  vault: {
    url  : '',
    token: ''
  },
  logger: {
    sentry: {
      dsn: ''
    },
    console: {
      level                          : 'silly',
      timestamp                      : true,
      handleExceptions               : true,
      humanReadableUnhandledException: true,
      colorize                       : true
    }
  }
});


module.exports = config;
