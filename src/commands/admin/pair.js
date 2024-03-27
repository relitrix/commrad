const { SlashCommandBuilder, ChannelType } = require('discord.js');
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

        await interaction.deferReply({ ephemeral: true })

        const resolve = await youtube.resolveURL(options.getString('youtube'))
        console.log(resolve)
        if (resolve.metadata?.page_type !== 'WEB_PAGE_TYPE_CHANNEL') return interaction.editReply({ content: "### ⚠️ Something wrong with YouTube link. It should be like this: `https://www.youtube.com/@MrBeast`" })

        const { count } = await GuildSchema.aggregate([
            { $match: { Guild: interaction.guild.id } },
            {
                $project: {
                    count: { $size: "$Pairs" }
                }
            }
        ]).then(result => result[0])
        console.log(count)
        if (count >= limits.channels) return interaction.editReply({ content: `### ⚠️ You have reached limit of ${limits.channels} channel(s) for Discord server.` })
        if (await GuildSchema.findOne({ Guild: interaction.guild.id, Pairs: { discordChannel: options.getChannel('discord').id, youtubeChannel: resolve.payload.browseId } })) return interaction.editReply({ content: "### ⚠️ This pair already exists." })


        const result = await GuildSchema.updateOne({ Guild: interaction.guild.id }, { $push: { Pairs: { discordChannel: options.getChannel('discord').id, youtubeChannel: resolve.payload.browseId, date: new Date() } } })
        await interaction.editReply({ content: `✅ Added successfully.\nAll new comments from last ${limits.videos} videos of [this channel](${options.getString('youtube')}) will go to <#${options.getChannel('discord').id}>` });
    },
};
