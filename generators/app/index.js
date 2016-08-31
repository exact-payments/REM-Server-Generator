const path       = require('path');
const yosay      = require('yosay');
const generators = require('yeoman-generator');
const fs         = require('fs');
const toCase     = require('to-case');



const genSchemaRequireSrc = (schemas) => schemas.map((schema) => {
  const req = `const ${schema.instanceName}Schema = require(\'../schema/${schema.name}\');`;
  return req;
}).join('\n');

const genSchemaSetupSrc = (schemas) => schemas.map((schema) => {
  const req = `this.mongoose.model(\'${schema.className}\', ${schema.instanceName}Schema);`;
  return req;
}).join('\n');

const genRouterRequireSrc = (routers) => routers.map((router) => {
  const req = `const ${router.instanceName}Router = require(\'../route/${router.name}\');`;
  return req;
}).join('\n');

const genRouterSetupSrc = (routers) => routers.map((router) => {
  const req = `this.expressApp.use(\'/${router.name}\', ${router.instanceName}Router);`;
  return req;
}).join('\n');


const genResourceNames = function(name) {
  return {
    name        : toCase.slug(name),
    className   : toCase.pascal(name),
    instanceName: toCase.camel(name)
  };
};


const serverGenerator = generators.Base.extend({
  prompting: {
    welcome() {
      this.log(yosay(
        '\'Allo \'allo! Out of the box I include Express and Mongoose, as well as a ' +
        'few other goodies, to build your REM Server.'));
    },
    ask() {
      return this.prompt([{
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
        default : (answers) => toCase.slug(answers.name)
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
      }]).then(answers => {

        this.serverName         = toCase.slug(answers.name);
        this.serverClassName    = toCase.pascal(answers.name);
        this.serverInstanceName = toCase.camel(answers.name);
        this.serverDescription  = answers.serverDescription;
        this.serverVersion      = answers.serverVersion;
        this.serverRevision     = answers.serverRevision;
        this.authorName         = answers.authorName;
        this.authorEmail        = answers.authorEmail;
        this.authorUrl          = answers.authorUrl;
        this.databaseName       = answers.databaseName;
        this.routers            = answers.routers || [];
        this.schemas            = answers.schemas || [];
        this.resources          = answers.resources || [];

        if (this.resources) {
          this.resources.forEach((resourceName) => {
            this.routers.push(resourceName);
            this.schemas.push(resourceName);
          });
          this.resources = this.resources.map(genResourceNames);
        }

        this.routers = this.routers.map(genResourceNames);
        this.schemas = this.schemas.map(genResourceNames);

        this.serverConfigName = this.serverInstanceName.toLowerCase();
        this.schemaRequireSrc = genSchemaRequireSrc(this.schemas);
        this.schemaSetupSrc   = genSchemaSetupSrc(this.schemas);
        this.routerRequireSrc = genRouterRequireSrc(this.routers);
        this.routerSetupSrc   = genRouterSetupSrc(this.routers);
      });
    }
  },

  writing: {
    circle() {
      this.fs.copy(
        this.templatePath('_circle.yml'),
        this.destinationPath('circle.yml')
      );
    },

    config() {
      this.fs.copyTpl(
        this.templatePath('config.js'),
        this.destinationPath('config.js'),
        {
          serverConfigName: this.serverConfigName,
          databaseName    : this.databaseName
        }
      );
    },

    gitignore() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    index() {
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('index.js'),
        {
          serverClassName: this.serverClassName,
          serverName     : this.serverName
        }
      );
    },

    eslintrc() {
      this.fs.copy(
        this.templatePath('eslintrc.json'),
        this.destinationPath('.eslintrc.json')
      );
    },

    eslintignore() {
      this.fs.copy(
        this.templatePath('eslintignore'),
        this.destinationPath('.eslintignore')
      );
    },

    logger() {
      this.fs.copy(
        this.templatePath('logger.js'),
        this.destinationPath('logger.js')
      );
    },

    NomadFile() {
      this.fs.copy(
        this.templatePath('_NomadFile.js'),
        this.destinationPath('NomadFile.js')
      );
    },

    packageJSON() {
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

    bin() {
      this.fs.copyTpl(
        this.templatePath('bin/bin'),
        this.destinationPath(`bin/${this.serverName}`),
        {
          splashName        : toCase.pascal(this.serverInstanceName),
          serverInstanceName: this.serverInstanceName
        }
      );
    },

    explainConfig() {
      this.fs.copyTpl(
        this.templatePath('bin/explain-config'),
        this.destinationPath(`bin/${this.serverName}-explain-config`),
        {
          splashName: toCase.pascal(this.serverInstanceName)
        }
      );
    },

    database() {
      this.fs.copyTpl(
        this.templatePath('lib/database.js'),
        this.destinationPath('lib/database.js'),
        {
          schemaRequireSrc: this.schemaRequireSrc,
          schemaSetupSrc  : this.schemaSetupSrc
        }
      );
    },

    main() {
      this.fs.copyTpl(
        this.templatePath('lib/main.js'),
        this.destinationPath(`lib/${this.serverName}.js`),
        { serverClassName: this.serverClassName }
      );
      this.fs.copyTpl(
        this.templatePath('test/lib.main.spec.js'),
        this.destinationPath(`test/lib.${this.serverName}.spec.js`),
        {
          serverClassName: this.serverClassName,
          serverInstanceName: this.serverInstanceName,
          name: this.serverName
        }
      );
    },

    server() {
      this.fs.copyTpl(
        this.templatePath('lib/server.js'),
        this.destinationPath('lib/server.js'),
        {
          routerRequireSrc: this.routerRequireSrc,
          routerSetupSrc  : this.routerSetupSrc
        }
      );
    },

    routers() {
      this.routers.forEach(router => {
        this.fs.copyTpl(
          this.templatePath('router.js'),
          this.destinationPath(`route/${router.name}.js`),
          router
        );
      });
    },

    schemas() {
      this.schemas.forEach(schema => {
        this.fs.copyTpl(
          this.templatePath('schema.js'),
          this.destinationPath(`schema/${schema.name}.js`),
          schema
        );
      });
    },

    resourceTests() {
      const otherFixtures = ['new', 'update'];
      const paths = [
        'test/lib.database.spec.js',
        'test/mock/logger.js'
      ];

      paths.forEach(path => {
        this.fs.copy(
          this.templatePath(path),
          this.destinationPath(path)
        );
      });

      this.resources.forEach(resource => {
        const templateArgs = {
          instanceName      : resource.instanceName,
          className         : resource.className,
          name              : resource.name,
          serverInstanceName: this.serverInstanceName
        };

        this.fs.copyTpl(
          this.templatePath('test/route.spec.js'),
          this.destinationPath(`test/route.${resource.name}.spec.js`),
          templateArgs
        );

        this.fs.copyTpl(
          this.templatePath('test/fixture/instance.js'),
          this.destinationPath(`test/fixture/${resource.name}-1.js`),
          templateArgs
        );

        otherFixtures.forEach(fixture => {
          this.fs.copyTpl(
            this.templatePath(`test/fixture/${fixture}.js`),
            this.destinationPath(`test/fixture/${fixture}-${resource.name}-1.js`),
            templateArgs
          );
        });
      });
    }
  },

  install() {
    fs.chmodSync(this.destinationPath(`bin/${this.serverName}`), '0755');
    fs.chmodSync(this.destinationPath(`bin/${this.serverName}-explain-config`), '0755');
    this.npmInstall();
  }
});


module.exports = serverGenerator;
