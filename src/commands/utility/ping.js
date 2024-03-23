const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check latency'),
    async execute(interaction) {
        await interaction.reply({ content: `Pong! API Latency: ${interaction.client.ws.ping} ms`, ephemeral: true });
    },
};
