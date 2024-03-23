const { Events, ActivityType } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
    name: Events.ClientReady,
    execute: async (client) => {
        console.log(`Ready! Looogged in as ${client.user.tag}`);
        require("../deploy-commands")(client.user.id)

        process.disClient = client
        //process.mongo = require('../mongodb')

        client.user.setPresence({
            activities: [{ name: `v${version}`, type: ActivityType.Custom }],
        });
    }
}
