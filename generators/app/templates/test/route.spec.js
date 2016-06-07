/* eslint-disable max-len */
/* global describe it before beforeEach after */

let request = require('request');
const assert = require('assert');
const sinon = require('sinon');
const assertContains = require('./lib/assert-contains');
const config = require('../config');

const new<%= className %>1Fixture = require('./fixture/new-<%= name %>-1.js');
const <%= instanceName %>1Fixture = require('./fixture/<%= name %>-1.js');
const update<%= className %>1Fixture = require('./fixture/update-<%= name %>-1.js');

config.server.url = 'http://localhost:8050';
config.mongo.url = 'mongodb://localhost/exact_batchd_test';
config.logger = {};

const test = require('../');
const connection = test.database.mongoose.connection;

request = request.defaults({ baseUrl: 'http://localhost:8050' });

describe('<%= className %> Routes', () => {
  before( (cb) => {
    sinon.stub(test.tribune, 'register').callsArgWith(2, null);
    test.start(cb);
  });
  beforeEach( (cb) => connection.db.collection('<%= instanceName %>s').remove({}, cb));
  after( (cb) => {
    sinon.stub(test.tribune, 'deregister').callsArgWith(0, null);
    test.stop(() => {
      test.tribune.register.restore();
      test.tribune.deregister.restore();
      cb();
    });
  });

  describe('Create <%= className %> Route - POST /', () => {
    it('creates a <%= instanceName %> document in the database', (cb) => {
      request.post('<%= instanceName %>', { json: new<%= className %>1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        connection.db.collection('<%= instanceName %>s').find({}).toArray((err, <%= instanceName %>s) => {
          if (err) { return cb(err); }

          assert.equal(<%= instanceName %>s.length, 1);

          const <%= instanceName %> = <%= instanceName %>s[0];
          <%= instanceName %>._id = <%= instanceName %>._id.toString();
          assertContains(<%= instanceName %>, new<%= className %>1Fixture);
          cb(null);
        });
      });
    });

    it('responds with the newly created account document and a 201 status code', (cb) => {
      request.post('<%= instanceName %>', { json: new<%= className %>1Fixture }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 201);
        assertContains(clientRes.body, new<%= className %>1Fixture);
        cb(null);
      });
    });

    it('responds with a 400 error if the body of the request does not align with the schema', (cb) => {
      request.post('<%= instanceName %>', { json: { foo: 'bar' } }, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 400);
        assert.ok(clientRes.body.match(/ValidationError/));
        cb(null);
      });
    });
  });
 
  describe('Query <%= className %> Route - GET /', () => {
    beforeEach( (cb) => connection.db.collection('<%= instanceName %>s').insertOne(<%= instanceName %>1Fixture, cb));

    it('searches for a <%= instanceName %> document by title in the database', (cb) => {
      request.get('<%= instanceName %>', { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assertContains(clientRes.body, [new<%= className %>1Fixture]);

        cb(null);
      });
    });
  });

  describe('Get <%= className %> Route - GET /:id', () => {
    beforeEach( (cb) => connection.db.collection('<%= instanceName %>s').insertOne(<%= instanceName %>1Fixture, cb));

    it('retrieves a <%= instanceName %> document in the database', (cb) => {
      request.get(`<%= instanceName %>/${<%= instanceName %>1Fixture._id.toString()}`, { json: true }, (err, clientRes) => {
        if (err) { return cb(err); }

        assertContains(clientRes.body, new<%= className %>1Fixture);

        cb(null);
      });
    });
  });

  describe('Update <%= className %> by Id Route - PUT /:id', () => {
    it('updates a document by id and responds with a 204', (cb) => {
      connection.db.collection('<%= instanceName %>s').insertOne(<%= instanceName %>1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put(`<%= instanceName %>/${<%= instanceName %>1Fixture._id.toString()}`, { json: update<%= className %>1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 204);

          connection.db.collection('<%= instanceName %>s').findOne({ _id: <%= instanceName %>1Fixture._id }, (err, <%= instanceName %>) => {
            if (err) { return cb(err); }

            assertContains(<%= instanceName %>, { title: 'Foo' } );

            cb(null);
          });
        });
      });
    });

    it('responds with a 404 error if a document does not exist with the given id', (cb) => {
      connection.db.collection('<%= instanceName %>s').insertOne(<%= instanceName %>1Fixture, (err) => {
        if (err) { return cb(err); }

        request.put('<%= instanceName %>/5d9e362ece1cf00fa05efb96', { json: update<%= className %>1Fixture }, (err, clientRes) => {
          if (err) { return cb(err); }

          assert.equal(clientRes.statusCode, 404);
          cb(null);
        });
      });
    });
  });

  describe('Remove <%= className %> Route - DELETE /:id', () => {
    beforeEach( (cb) => connection.db.collection('<%= instanceName %>s').insertOne(<%= instanceName %>1Fixture, cb));

    it('removes a <%= instanceName %> document from the database', (cb) => {
      request.delete(`<%= instanceName %>/${<%= instanceName %>1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('<%= instanceName %>s').findOne({ _id: <%= instanceName %>1Fixture._id }, (err, <%= instanceName %>) => {
          if (err) { return cb(err); }

          assert.ok(<%= instanceName %>.removedAt instanceof Date);
          cb(null);
        });
      });
    });
  });

  describe('Restore <%= className %> Route - POST /restore/:id', () => {
    beforeEach( (cb) => {
      connection.db.collection('<%= instanceName %>s').insertOne(
        Object.assign({}, <%= instanceName %>1Fixture, { removedAt: new Date() }),
        cb
      );
    });

    it('restores a <%= instanceName %> document in the database', (cb) => {
      request.post(`<%= instanceName %>/restore/${<%= instanceName %>1Fixture._id.toString()}`, (err, clientRes) => {
        if (err) { return cb(err); }

        assert.equal(clientRes.statusCode, 204);

        connection.db.collection('<%= instanceName %>s').findOne({ _id: <%= instanceName %>1Fixture._id }, (err, <%= instanceName %>) => {
          if (err) { return cb(err); }

          assert.ok(!<%= instanceName %>.removedAt);

          cb(null);
        });
      });
    });
  });
});
