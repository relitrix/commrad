const { Events, ActivityType } = require('discord.js');
const { version } = require('../../package.json');
const GuildInitialize = require('../utils/GuildInit')
const { Innertube } = require('youtubei.js')
const path = require('node:path');

module.exports = {
    name: Events.ClientReady,
    execute: async (client) => {
        console.log(`Ready! Looogged in as ${client.user.tag}`);
        require("../deploy-commands")(client.user.id)

        try {
            const youtube = await Innertube.create({ retrieve_player: false })
            process.youtube = youtube
            console.log("Connected to YouTube.")
        } catch (e) {
            throw "Failed to connect YouTube... Check ready.js:12"
        }

        process.disClient = client
        process.mongo = require('../mongodb')

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

        const { AgendaScheduler } = process.mongo
        await AgendaScheduler.start()
        AgendaScheduler.define("commentsWave", require(path.resolve(__dirname, "../jobs/commentsWave")))
        AgendaScheduler.every("5 minutes", "commentsWave")
        AgendaScheduler.on('fail', (err, job) => {
            console.error(err)
        });
    }
}
