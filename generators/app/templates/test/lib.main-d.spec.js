/* eslint-disable max-len */
/* global describe it */

const assert = require('assert');
const sinon = require('sinon');
const <%= serverClassName %> = require('../lib/<%= name %>');
const logger = require('./mock/logger');

describe('new <%= serverClassName %>(config, logger) -> <%= serverInstanceName %>', () => {
  describe('#start(cb(err))', () => {
    it('starts the database and server', sinon.test((cb) => {
      const config = {
        vault: {},
        server: {
          url    : 'http://localhost:8000',
          sslCA  : '',
          sslKey : '',
          sslCert: '',
        }
      };
      const <%= serverInstanceName %> = new <%= serverClassName %>(config, logger);

      sinon.stub(<%= serverInstanceName %>.database, 'connect').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.server, 'listen').callsArgWith(0, null);

      <%= serverInstanceName %>.start((err, result) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(<%= serverInstanceName %>.database.connect);
        sinon.assert.calledOnce(<%= serverInstanceName %>.server.listen);

        assert.deepEqual(result, { url: 'http://localhost:8000' });

        cb(null);
      });
    }));
  });

  describe('#stop(cb(err))', () => {
    it('starts the database and server', sinon.test((cb) => {
      const config = {
        server: { sslCA: '', sslKey: '', sslCert: '' }
      };
      const <%= serverInstanceName %> = new <%= serverClassName %>(config, logger);

      <%= serverInstanceName %>.isRunning = true;

      sinon.stub(<%= serverInstanceName %>.database, 'disconnect').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.server, 'close').callsArgWith(0, null);

      <%= serverInstanceName %>.stop((err) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(<%= serverInstanceName %>.database.disconnect);
        sinon.assert.calledOnce(<%= serverInstanceName %>.server.close);

        cb(null);
      });
    }));
  });
});
