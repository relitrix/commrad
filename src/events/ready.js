const { Events, ActivityType } = require('discord.js');
const { version } = require('../../package.json');
const GuildInitialize = require('../utils/GuildInit')
const { Innertube } = require('youtubei.js');

module.exports = {
    name: Events.ClientReady,
    execute: async (client) => {
        console.log(`Ready! Looogged in as ${client.user.tag}`);
        require("../deploy-commands")(client.user.id)

        const youtube = await Innertube.create({})
        process.disClient = client
        process.mongo = require('../mongodb')
        process.youtube = youtube

        client.user.setPresence({
            activities: [{ name: `v${version}`, type: ActivityType.Custom }],
        });

        const guilds = client.guilds.cache.map(guild => guild);
        guilds.forEach(async guild => {
            try {
                await GuildInitialize.Init(guild)
            } catch (e) {
                console.error(e)
            }
        })
    }
}
