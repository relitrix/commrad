const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Guild: String,
    DataVersion: Number,

    Pairs: [Object],
    Stats: {
        DataVersion: Number,
        Sended: Number
    }
});
module.exports = mongo.model('guilds', Schema);
