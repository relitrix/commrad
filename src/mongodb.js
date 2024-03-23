const mongoose = require('mongoose');
const connectionString = `mongodb://mongo:27017/trackcomdb?authMechanism=DEFAULT&retryWrites=true&w=majority`
mongoose.connect(connectionString).then(console.log('Connected to Mongodb.'));

module.exports = {
    GuildSchema: require('./models/Guild'),
}