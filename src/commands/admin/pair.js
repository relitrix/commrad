const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const limits = require('../../limits')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pair')
        .setDescription('Links Discord channel and YouTube channel.')
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName("discord")
                .setDescription("Discord channel to link YT.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("youtube")
                .setDescription("Link to YT channel.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const { GuildSchema } = process.mongo
        const options = interaction.options
        const youtube = process.youtube

        const textchannel = options.getChannel('discord')
        if (!textchannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages + PermissionFlagsBits.ViewChannel + PermissionFlagsBits.EmbedLinks)) return await interaction.reply({ content: "### ⚠️ I don't have permissions to send messages in this channel.", ephemeral: true })

        await interaction.deferReply({ ephemeral: true })

        const resolve = await youtube.resolveURL(options.getString('youtube'))
        if (resolve.metadata?.page_type !== 'WEB_PAGE_TYPE_CHANNEL') return interaction.editReply({ content: "### ⚠️ Something wrong with YouTube link. It should be like this: `https://www.youtube.com/@MrBeast`" })

        const { count } = await GuildSchema.aggregate([
            { $match: { Guild: interaction.guild.id } },
            {
                $project: {
                    count: { $size: "$Pairs" }
                }
            }
        ]).then(result => result[0])
        if (count >= limits.channels) return interaction.editReply({ content: `### ⚠️ You have reached limit of ${limits.channels} channel(s) for Discord server.` })
        const pairInfo = await GuildSchema.findOne({ Guild: interaction.guild.id, Pairs: { $elemMatch: { youtubeChannel: resolve.payload.browseId } } }, { "Pairs.$": 1 })
        if (pairInfo) return interaction.editReply({ content: `### ⚠️ This YouTube channel already paired with <#${pairInfo.Pairs[0].discordChannel}>` })

        const result = await GuildSchema.updateOne({ Guild: interaction.guild.id }, { $push: { Pairs: { discordChannel: options.getChannel('discord').id, youtubeChannel: resolve.payload.browseId, date: new Date() } } })
        await interaction.editReply({ content: `✅ Added successfully.\nAll new comments will go to <#${options.getChannel('discord').id}>` });
    },
};
