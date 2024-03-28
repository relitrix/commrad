module.exports = async (client) => {
    const { GuildSchema } = process.mongo
    const fetchComms = require('../utils/fetchComms')
    const buildEmbed = require('../utils/buildEmbed')
    const chunkArray = require('../utils/chunkArray')


    const guildAndPair = await GuildSchema.find({ Pairs: { $exists: true, $not: { $size: 0 } } }, { Guild: 1, Pairs: 1 })

    guildAndPair.forEach(async (obj) => {
        try {
            const guild = await client.guilds.fetch(obj.Guild)
            obj.Pairs.forEach(async pair => {
                const discordChannel = await guild.channels.fetch(pair.discordChannel)
                fetchComms(pair.youtubeChannel).then(result => {
                    if (!result.length) return
                    const newComms = result.filter(comm => comm.date > pair.date)
                    const embeds = []
                    const promises = []
                    newComms.forEach(comm => {
                        promises.push(process.youtube.getBasicInfo(comm.vidId).then(result => {
                            console.log(result)
                            embeds.push(buildEmbed({
                                title: result?.basic_info?.title,
                                authorLink: comm.authorLink,
                                authorName: comm.authorName,
                                authorPic: comm.authorPic,
                                content: comm.content,
                                date: comm.date,
                                vidLink: `https://youtube.com/watch?v=${comm.vidId}&lc=${comm.id}`,
                                vidThumbnail: result?.basic_info?.thumbnail[0].url
                            }))
                        }))
                    })
                    Promise.all(promises).then(() => {
                        const chunks = chunkArray(embeds, 10)
                        console.log(chunks.length)
                        chunks.forEach(async chunk => {
                            await discordChannel.send({ embeds: chunk })
                        })
                        console.log(newComms.length)
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