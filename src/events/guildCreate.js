const { Events } = require('discord.js')
const GuildInit = require('../utils/GuildInit')

module.exports = {
    name: Events.GuildCreate,
    execute: async (guild) => {
        try {
            await GuildInit.Init(guild)
            console.log(`Joined new server ${guild.id}.`);
        } catch (e) {
            console.error(e)
        }
    }
}