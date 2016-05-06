const Schema        = require('mongoose').Schema;
const mongooseSlugs = require('../lib/mongoose-slugs');


const <%= instanceName %>Schema = new Schema({
  title: { type: String },
  body:  { type: String }
});

<%= instanceName %>Schema.plugin(mongooseSlugs);


module.exports = <%= instanceName %>Schema;
