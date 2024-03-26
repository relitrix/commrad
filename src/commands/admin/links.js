const { SlashCommandBuilder, ChannelType, EmbedBuilder, escapeMarkdown } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Lists all links for this Discord server.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const { GuildSchema } = process.mongo
        const options = interaction.options
        const { Pairs } = await GuildSchema.findOne({ Guild: interaction.guild.id }, { Pairs: 1 })
        const youtube = process.youtube
        let youtubeChannelNames = new Map()
        const promises = []
        Pairs.forEach(({ youtubeChannel }) => {
            promises.push(youtube.getChannel(youtubeChannel).then(result => youtubeChannelNames.set(youtubeChannel, result.metadata.title)))

        })
        await Promise.all(promises)
        const embed = new EmbedBuilder()
            .setDescription(Pairs.map(({ discordChannel, youtubeChannel }, i) => `${i + 1}. <:disc:1221228641946566858> <#${discordChannel}> ↔️ <:yt:1221228661068533770> ${escapeMarkdown(youtubeChannelNames.get(youtubeChannel))} [(link)](https://www.youtube.com/channel/${youtubeChannel})\n`).join(''))
        await interaction.editReply({ embeds: [embed] });
    },
};
