const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Local and global stats.'),
    async execute(interaction) {
        const { GuildSchema } = process.mongo
        const guildData = await GuildSchema.findOne({ Guild: interaction.guild.id }, { Stats: 1 })
        const result = await GuildSchema.aggregate([{
            $group: {
                _id: null,
                sended: { $sum: '$Stats.Sended' }
            }
        }, {
            $project: {
                _id: 0,
                sended: '$sended'
            }
        }])
        console.log(result)
        await interaction.reply({
            content: `Guild:\n> Sent comments: ${guildData.Stats.Sended}\nGlobal:\n> Sent comments: ${result[0].sended}`, ephemeral: true
        });
    },
};
