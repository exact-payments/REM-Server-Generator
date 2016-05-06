var MongoClient = require('mongodb').MongoClient;
var config      = require('./config');


module.exports = function(nomad) {

  nomad.driver({
    connect: function(cb) {
      MongoClient.connect(config.server.url, (err, db) => {
        if (err) { return cb(err); }
        this.db = db;
        cb(null, db);
      });
    },

    disconnect: function(cb) {
      this.db.close(cb);
    },

    createMigration: function(migration, cb) {
      this.db.collection('migrations').insertOne(migration, cb);
    },

    updateMigration: function(filename, migration, cb) {
      this.db.collection('migrations').updateOne({
        filename: filename
      }, {
        $set: migration
      }, cb);
    },

    getMigrations: function(cb) {
      this.db.collection('migrations').find().toArray(cb);
    }
  });
};
