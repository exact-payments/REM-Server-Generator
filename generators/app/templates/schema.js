const Schema        = require('mongoose').Schema;
const mongooseSlugs = require('mongoose-document-slugs');


const <%= instanceName %>Schema = new Schema({
  title: { type: String, required: true },
  body:  { type: String }
});

<%= instanceName %>Schema.plugin(mongooseSlugs);


module.exports = <%= instanceName %>Schema;
