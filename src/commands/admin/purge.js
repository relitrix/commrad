const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('DANGER! Deletes all links for this Discord server.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const { GuildSchema } = process.mongo
        const options = interaction.options
        const result = await GuildSchema.updateOne({ Guild: interaction.guild.id }, { $set: { Pairs: [] } })
        await interaction.reply({ content: `Purged successfully.`, ephemeral: true });
    },
};
