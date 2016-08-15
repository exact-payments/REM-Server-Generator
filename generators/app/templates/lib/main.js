const async       = require('async');
const Database    = require('./database');
const Server      = require('./server');
const vaultConfig = require('@fintechdev/vault-config');

class <%= serverClassName %> {

  constructor(config, logger) {
    this.config    = config;
    this.logger    = logger.child({ context: '<%= serverClassName %>' });
    this.isRunning = false;
    this.database  = new Database(config, this.logger);
    this.server    = new Server(config, this.logger, this.database);
  }

  start(cb) {
    if (this.isRunning) {
      throw new Error('Cannot start <%= serverClassName %> because it is already running');
    }
    this.isRunning = true;

    this.logger.verbose('Starting <%= serverClassName %>');

    this.logger.verbose('Compiling Vault secrets into config');
    const vaultUrl   = this.config.vault.url;
    const vaultToken = this.config.vault.token;
    vaultConfig(vaultUrl, vaultToken, this.config, (err) => {
      if (err) { return cb(err); }
      this.logger.verbose('Config compiled.');

      async.parallel([
        (cb) => this.database.connect(cb),
        (cb) => this.server.listen(cb)
      ], (err) => {
        if (err) { return cb(err); }

        this.logger.verbose('<%= serverClassName %> ready and awaiting requests');
        cb(null, { url: this.config.server.url });
      });
    });
  }

  stop(cb) {
    if (!this.isRunning) {
      throw new Error('Cannot stop <%= serverClassName %> because it is already stopping');
    }
    this.isRunning = false;

    this.logger.verbose('Stopping <%= serverClassName %>');
    async.parallel([
      (cb) => { this.database.disconnect(cb); },
      (cb) => { this.server.close(cb); }
    ], (err) => {
      if (err) { return cb(err); }

      this.logger.verbose('<%= serverClassName %> has closed all connections and successfully halted');
      cb(null);
    });
  }
}


module.exports = <%= serverClassName %>;
