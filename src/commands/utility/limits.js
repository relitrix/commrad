const { SlashCommandBuilder } = require('discord.js');
const limits = require('../../limits')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limits')
        .setDescription('Get current limits.'),
    async execute(interaction) {
        await interaction.reply({ content: `Channels: ${limits.channels}\nVideos: ${limits.videos}`, ephemeral: true });
    },
};
