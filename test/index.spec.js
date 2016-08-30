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

  describe('bin', () => {
    it('generates a bin/server-name file', () => {
      assert.file(['bin/server-name']);
    });

    it('generates a bin/server-name-explain-config file', () => {
      assert.file(['bin/server-name-explain-config']);
    });
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

  describe('spec', () => {
    it('generates a test/lib.database.spec.js file', () => {
      assert.file(['test/lib.database.spec.js']);
    });

    it('generates a test/lib.server-name.spec.js file', () => {
      assert.file(['test/lib.server-name.spec.js']);
    });

    it('generates a test/route.baz-baz.spec.js file', () => {
      assert.file(['test/route.baz-baz.spec.js']);
    });

    it('generates a test/route.foo.spec.js file', () => {
      assert.file(['test/route.foo.spec.js']);
    });

    it('generates a test/route.bar.spec.js file', () => {
      assert.file(['test/route.bar.spec.js']);
    });
  });

});
