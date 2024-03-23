module.exports = {
    Init: async (guild) => {
        const { GuildSchema } = process.mongo

        try {
            const guildData = await GuildSchema.findOne({ Guild: guild.id })
            if (!guildData) {
                await GuildSchema.create({
                    Guild: guild.id,
                    DataVersion: 1,
                })
            }
        } catch (e) {
            console.error(e)
        }
    },
}