var path       = require('path');
var yosay      = require('yosay');
var chalk      = require('chalk');
var figlet     = require('figlet');
var generators = require('yeoman-generator');
var fs         = require('fs');


var toCase = (str, strCase) => {
  str = str.replace(/[^\w\d_-]/, '');

  if (strCase === 'kebab-case') {
    return str
      .replace(/([\w\d])[_ ]([\w\d])/g, (_, m1, m2) => m1 + '-' + m2)
      .replace(/([\w\d])?([A-Z])/g, (_, m1, m2) => m1 ? m1 + '-' + m2.toLowerCase() : m2.toLowerCase());
  }
  if (strCase === 'camelCase') {
    return str.replace(/([\w\d])[-_ ]([\w\d])/g, (_, m1, m2) => m1 + m2.toUpperCase());
  }
  if (strCase === 'ClassCase') {
    str = str.replace(/([\w\d])[-_ ]([\w\d])/g, (_, m1, m2) => m1 + m2.toUpperCase());
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  throw new Error(strCase + ' is an invalid string case');
};

var genSplash = (serverName) => {
  return figlet.textSync(serverName, { font: 'Ogre' })
    .replace(/([\\'])/g, (_, m1) => '\\' + m1)
    .split('\n')
    .map((l) => 'console.log(\'' + l + '\');')
    .join('\n');
};

var genSchemaRequireSrc = (schemas) => {
  return schemas.map((schema) => {
    return 'const ' + schema.instanceName + 'Schema = require(\'../schema/' + schema.name + '\');';
  }).join('\n');
};

var genSchemaSetupSrc = (schemas) => {
  return schemas.map((schema) => {
    return '    this.mongoose.model(\'' + schema.className + '\', ' + schema.instanceName + 'Schema);';
  }).join('\n');
};

var genRouterRequireSrc = (routers) => {
  return routers.map((router) => {
    return 'const ' + router.instanceName + 'Router = require(\'../route/' + router.name + '\');';
  }).join('\n');
};

var genRouterSetupSrc = (routers) => {
  return routers.map((router) => {
    return '    this.expressApp.use(\'/' + router.name + '\', ' + router.instanceName + 'Router);';
  }).join('\n');
};

var genResourceNames = function(name) {
  return {
    name        : toCase(name, 'kebab-case'),
    className   : toCase(name, 'ClassCase'),
    instanceName: toCase(name, 'camelCase')
  };
};


var serverGenerator = generators.Base.extend({
  prompting: {
    welcome: function() {
      this.log(yosay('\'Allo \'allo! Out of the box I include Express and Mongoose, as well as a few other goodies, to build your REM Server.'));
    },
    ask: function() {
      var done = this.async();
      this.prompt([{
        name    : 'name',
        type    : 'input',
        message : 'What is the name of the server?',
        default : path.basename(this.destinationPath())
      }, {
        name    : 'serverDescription',
        type    : 'input',
        message : 'How would you describe the server?'
      }, {
        name    : 'serverVersion',
        type    : 'input',
        message : 'What version is this server?',
        default : '0.1.0'
      }, {
        name    : 'serverRevision',
        type    : 'input',
        message : 'What revision name do you want to use?',
        default : 'inDev'
      }, {
        name    : 'authorName',
        type    : 'input',
        message : 'Who is the author?',
        store   : true
      }, {
        name    : 'authorEmail',
        type    : 'input',
        message : 'And their email?',
        store   : true
      }, {
        name    : 'authorUrl',
        type    : 'input',
        message : 'What about the url to their website?',
        store   : true
      }, {
        name    : 'databaseName',
        type    : 'input',
        message : 'what should the database be named?',
        default : (answers) => toCase(answers.name, 'kebab-case')
      }, {
        name   : 'generationType',
        type   : 'checkbox',
        message: 'What should I use to generate your REM server?',
        choices: [
          {
            name   : 'Resources',
            value  : 'resources',
            checked: true
          }, {
            name : 'Routers',
            value: 'routers'
          }, {
            name : 'Schemas',
            value: 'schemas'
          }
        ],
        validate: (answer) => answer.length > 0
      }, {
        when    : (answers) => answers.generationType.indexOf('resources') > -1,
        name    : 'resources',
        type    : 'input',
        message : 'What resources do you want me to add?',
        filter  : (answer) => answer.split(' '),
        validate: (answer) => (/^[\w\d-]+(?: [\w\d-]+)*$/).test(answer)
      }, {
        when    : (answers) => answers.generationType.indexOf('routers') > -1,
        name    : 'routers',
        type    : 'input',
        message : 'What routers do you want me to add?',
        filter  : (answer) => answer.split(' '),
        validate: (answer) => (/^[\w\d-]+(?: [\w\d-]+)*$/).test(answer)
      }, {
        when    : (answers) => answers.generationType.indexOf('schemas') > -1,
        name    : 'schemas',
        type    : 'input',
        message : 'What schemas do you want me to add?',
        filter  : (answer) => answer.split(' '),
        validate: (answer) => (/^[\w\d-]+(?: [\w\d-]+)*$/).test(answer)
      }], (answers) => {

        this.serverName         = toCase(answers.name, 'kebab-case');
        this.serverClassName    = toCase(answers.name, 'ClassCase');
        this.serverInstanceName = toCase(answers.name, 'camelCase');
        this.serverDescription  = answers.serverDescription;
        this.serverVersion      = answers.serverVersion;
        this.serverRevision     = answers.serverRevision;
        this.authorName         = answers.authorName;
        this.authorEmail        = answers.authorEmail;
        this.authorUrl          = answers.authorUrl;
        this.databaseName       = answers.databaseName;
        this.routers            = answers.routers || [];
        this.schemas            = answers.schemas || [];

        if (answers.resources) {
          answers.resources.forEach((resouceName) => {
            this.routers.push(resouceName);
            this.schemas.push(resouceName);
          });
        }

        this.routers = this.routers.map(genResourceNames);
        this.schemas = this.schemas.map(genResourceNames);

        this.serverConfigName = this.serverInstanceName.toLowerCase();
        this.splashSrc        = genSplash(this.serverName);
        this.schemaRequireSrc = genSchemaRequireSrc(this.schemas);
        this.schemaSetupSrc   = genSchemaSetupSrc(this.schemas);
        this.routerRequireSrc = genRouterRequireSrc(this.routers);
        this.routerSetupSrc   = genRouterSetupSrc(this.routers);

        done(null);
      });
    }
  },

  writing: {
    config: function() {
      this.fs.copyTpl(
        this.templatePath('config.js'),
        this.destinationPath('config.js'),
        {
          serverConfigName: this.serverConfigName,
          databaseName    : this.databaseName
        }
      );
    },

    gitignore: function() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    index: function() {
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('index.js'),
        {
          serverClassName: this.serverClassName,
          serverName     : this.serverName
        }
      );
    },

    jscsrc: function() {
      this.fs.copy(
        this.templatePath('jscsrc'),
        this.destinationPath('.jscsrc')
      );
    },

    logger: function() {
      this.fs.copy(
        this.templatePath('logger.js'),
        this.destinationPath('logger.js')
      );
    },

    NomadFile: function() {
      this.fs.copy(
        this.templatePath('_NomadFile.js'),
        this.destinationPath('NomadFile.js')
      );
    },

    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          serverName       : this.serverName,
          serverDescription: this.serverDescription,
          serverVersion    : this.serverVersion,
          serverRevision   : this.serverRevision,
          authorName       : this.authorName,
          authorEmail      : this.authorEmail,
          authorUrl        : this.authorUrl
        }
      );
    },

    bin: function() {
      this.fs.copyTpl(
        this.templatePath('bin/bin'),
        this.destinationPath('bin/' + this.serverName),
        { splashSrc: this.splashSrc }
      );
    },

    database: function() {
      this.fs.copyTpl(
        this.templatePath('lib/database.js'),
        this.destinationPath('lib/database.js'),
        {
          schemaRequireSrc: this.schemaRequireSrc,
          schemaSetupSrc  : this.schemaSetupSrc
        }
      );
    },

    main: function() {
      this.fs.copyTpl(
        this.templatePath('lib/main.js'),
        this.destinationPath('lib/' + this.serverName + '.js'),
        { serverClassName: this.serverClassName }
      );
    },

    mongooseSlugs: function() {
      this.fs.copy(
        this.templatePath('lib/mongoose-slugs.js'),
        this.destinationPath('lib/mongoose-slugs.js')
      );
    },

    server: function() {
      this.fs.copyTpl(
        this.templatePath('lib/server.js'),
        this.destinationPath('lib/server.js'),
        {
          routerRequireSrc: this.routerRequireSrc,
          routerSetupSrc  : this.routerSetupSrc
        }
      );
    },

    vaultConfig: function() {
      this.fs.copy(
        this.templatePath('lib/vault-config.js'),
        this.destinationPath('lib/vault-config.js')
      );
    },

    winstonChildLogger: function() {
      this.fs.copy(
        this.templatePath('lib/winston-child-logger.js'),
        this.destinationPath('lib/winston-child-logger.js')
      );
    },

    winstonSentryTransport: function() {
      this.fs.copy(
        this.templatePath('lib/winston-sentry-transport.js'),
        this.destinationPath('lib/winston-sentry-transport.js')
      );
    },

    routers: function() {
      var _this = this;
      this.routers.forEach(function(router) {
        _this.fs.copyTpl(
          _this.templatePath('router.js'),
          _this.destinationPath('route/' + router.name + '.js'),
          router
        );
      });
    },

    schemas: function() {
      var _this = this;
      this.schemas.forEach(function(schema) {
        _this.fs.copyTpl(
          _this.templatePath('schema.js'),
          _this.destinationPath('schema/' + schema.name + '.js'),
          schema
        );
      });
    }
  },

  install: function() {
    fs.chmodSync(this.destinationPath('bin/' + this.serverName), 0755);
    this.installDependencies();
  }
});


module.exports = serverGenerator;
