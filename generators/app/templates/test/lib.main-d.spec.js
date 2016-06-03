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
        consul: { url: 'http://localhost:8001' },
        vault: {},
        server: { url: 'http://localhost:8000' } };
      const <%= serverInstanceName %> = new <%= serverClassName %>(config, logger);

      sinon.stub(<%= serverInstanceName %>.database, 'connect').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.server, 'listen').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.tribune, 'register').callsArgWith(2, null);

      <%= serverInstanceName %>.start((err, result) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(<%= serverInstanceName %>.database.connect);
        sinon.assert.calledOnce(<%= serverInstanceName %>.server.listen);
        sinon.assert.calledOnce(<%= serverInstanceName %>.tribune.register);

        assert.deepEqual(result, { url: 'http://localhost:8000' });

        cb(null);
      });
    }));
  });

  describe('#stop(cb(err))', () => {
    it('starts the database and server', sinon.test((cb) => {
      const config = { consul: { url: 'http://localhost:8001' } };
      const <%= serverInstanceName %> = new <%= serverClassName %>(config, logger);

      <%= serverInstanceName %>.isRunning = true;

      sinon.stub(<%= serverInstanceName %>.database, 'disconnect').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.server, 'close').callsArgWith(0, null);
      sinon.stub(<%= serverInstanceName %>.tribune, 'deregister').callsArgWith(0, null);

      <%= serverInstanceName %>.stop((err) => {
        if (err) { return cb(err); }

        sinon.assert.calledOnce(<%= serverInstanceName %>.database.disconnect);
        sinon.assert.calledOnce(<%= serverInstanceName %>.server.close);
        sinon.assert.calledOnce(<%= serverInstanceName %>.tribune.deregister);

        cb(null);
      });
    }));
  });
});
