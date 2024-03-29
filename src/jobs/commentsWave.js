module.exports = async (client) => {
    const { GuildSchema } = process.mongo
    const fetchComms = require('../utils/fetchComms')
    const buildEmbed = require('../utils/buildEmbed')
    const chunkArray = require('../utils/chunkArray')

    async function embeds(newComms) {
        const promises = newComms.map(async comm => {
            let basicInfo = null
            try {
                if (comm.vidId)
                    basicInfo = await process.youtube.getBasicInfo(comm.vidId)
            } catch (e) {
                console.log("Failed to get basicInfo")
                console.error(e)
            }
            return buildEmbed({
                title: basicInfo?.basic_info?.title,
                authorLink: comm.authorLink,
                authorName: comm.authorName,
                authorPic: comm.authorPic,
                content: comm.content,
                date: comm.date,
                vidLink: basicInfo ? `https://youtube.com/watch?v=${comm.vidId}&lc=${comm.id}` : null,
                vidThumbnail: basicInfo?.basic_info?.thumbnail[0].url
            })
        })
        return await Promise.all(promises)
    }


    const guildAndPair = await GuildSchema.find({ Pairs: { $exists: true, $not: { $size: 0 } } }, { Guild: 1, Pairs: 1 })

    guildAndPair.forEach(async (obj) => {
        try {
            const guild = await client.guilds.fetch(obj.Guild)
            obj.Pairs.forEach(async pair => {
                const discordChannel = await guild.channels.fetch(pair.discordChannel)
                fetchComms(pair.youtubeChannel).then(result => {
                    if (!result.length) return
                    const newComms = result.filter(comm => comm.date > pair.date)
                    embeds(newComms).then((results) => {
                        const chunks = chunkArray(results, 10)
                        chunks.forEach(async chunk => {
                            await discordChannel.send({ embeds: chunk })
                        })
                    })
                }).then(async () => {
                    await GuildSchema.updateOne({ Guild: guild.id, Pairs: { $elemMatch: { discordChannel: pair.discordChannel, youtubeChannel: pair.youtubeChannel } } }, { "Pairs.$[].date": new Date() })
                })

            })
        } catch (e) {
            return console.error(e)
        }
    })
}