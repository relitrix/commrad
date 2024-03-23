const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test comments fetching')
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("url")
                .setDescription("Link to YouTube video")
        ),
    async execute(interaction) {
        const { GuildSchema } = process.mongo
        const options = interaction.options
        const youtube = process.youtube
        const results = await youtube.getComments(options.getString('url'), "NEWEST_FIRST")
        console.log(results)
        await interaction.reply({ content: `OK.`, ephemeral: true });
    },
};
