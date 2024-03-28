const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Guild: String,
    DataVersion: Number,

    Pairs: [Object],
});
module.exports = mongo.model('guilds', Schema);
