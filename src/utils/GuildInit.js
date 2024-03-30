module.exports = {
    Init: async (guild) => {
        const { GuildSchema } = process.mongo

        try {
            const guildData = await GuildSchema.findOne({ Guild: guild.id })
            if (!guildData) {
                await GuildSchema.create({
                    Guild: guild.id,
                    DataVersion: 2,
                })
            } else
                if (guildData.DataVersion < 2) {
                    guildData.DataVersion = 2
                    guildData.Stats = { DataVersion: 1, Sended: 0 }
                    guildData.save()
                }
        } catch (e) {
            console.error(e)
        }
    },
}