/* eslint-disable max-len */
/* global describe before it */

const helpers = require('yeoman-test');
const assert  = require('yeoman-assert');
const path    = require('path');

describe('REM-Server-Generator', () => {

  before(() => helpers.run(path.join(__dirname, '../generators/app'))
    .withPrompts({
      name             : 'serverName',
      serverDescription: 'serverDescription',
      serverVersion    : 'serverVersion',
      serverRevision   : 'serverRevision',
      authorName       : 'authorName',
      authorEmail      : 'authorEmail',
      authorUrl        : 'authorUrl',
      generationType   : ['resources'],
      resources        : ['foo', 'bar', 'BazBaz'],
      databaseName     : 'databaseName'
    })
    .toPromise());


  it('generates an index.js file', () => {
    assert.file(['index.js']);
  });

  it('generates a config.js file', () => {
    assert.file(['config.js']);
  });

  it('generates a logger.js file', () => {
    assert.file(['logger.js']);
  });

  it('generates a package.json file', () => {
    assert.file(['package.json']);
  });

  it('generates a .eslintignore file', () => {
    assert.file(['.eslintignore']);
  });

  it('generates a .eslintrc.json file', () => {
    assert.file(['.eslintrc.json']);
  });

  it('generates a .gitignore file', () => {
    assert.file(['.gitignore']);
  });

  describe('lib', () => {
    it('generates a lib/server-name.js file', () => {
      assert.file(['lib/server-name.js']);
    });

    it('generates a lib/database.js file', () => {
      assert.file(['lib/database.js']);
    });

    it('generates a lib/server.js file', () => {
      assert.file(['lib/server.js']);
    });
  });

  describe('route', () => {
    it('generates a route/foo.js file', () => {
      assert.file(['route/foo.js']);
    });

    it('generates a route/bar.js file', () => {
      assert.file(['route/bar.js']);
    });

    it('generates a route/baz-baz.js file', () => {
      assert.file(['route/baz-baz.js']);
    });
  });

  describe('schema', () => {
    it('generates a schema/foo.js file', () => {
      assert.file(['schema/foo.js']);
    });

    it('generates a schema/bar.js file', () => {
      assert.file(['schema/bar.js']);
    });

    it('generates a schema/baz-baz.js file', () => {
      assert.file(['schema/baz-baz.js']);
    });
  });

});
