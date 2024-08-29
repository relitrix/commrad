const fetchComms = require('../utils/fetchComms')
const buildEmbed = require('../utils/buildEmbed')
const chunkArray = require('../utils/chunkArray')

module.exports = async () => {
    const client = process.disClient
    const { GuildSchema } = process.mongo
    async function makeEmbeds(newComms, creator = {}) {
        const videobasicInfos = new Map()
        const promises = newComms.map(async comm => {
            let basicInfo = null
            try {
                if (comm.vidId) {
                    basicInfo = videobasicInfos.get(comm.vidId) ?? await process.youtube.getBasicInfo(comm.vidId)
                    videobasicInfos.set(comm.vidId, basicInfo)
                }
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
                vidThumbnail: basicInfo?.basic_info?.thumbnail[0].url,
                creator: creator
            })
        })
        return await Promise.all(promises)
    }


    const guildAndPair = await GuildSchema.find({ Pairs: { $exists: true, $not: { $size: 0 } } }, { Guild: 1, Pairs: 1 })


    const guildPromises = guildAndPair.map(async (obj) => {
        const guild = await client.guilds.fetch(obj.Guild)
        let commentsSendedCounter = 0
        const pairPromises = obj.Pairs.map(async pair => {
            const discordChannel = await guild.channels.fetch(pair.discordChannel)
            let youtubeChannel = {}
            try {
                youtubeChannel = await process.youtube.getChannel(pair.youtubeChannel)
            } catch (e) {
                console.error(e)
            }
            return await fetchComms(pair.youtubeChannel).then(async result => {
                if (!result.length) return
                const newComms = result.filter(comm => comm.date > pair.date)
                const embeds = await makeEmbeds(newComms, { name: youtubeChannel?.metadata?.title, pic: youtubeChannel?.metadata?.thumbnail?.[0]?.url })
                const chunks = chunkArray(embeds.reverse(), 10)
                const messagePromises = chunks.map(async chunk => {
                    await discordChannel.send({ embeds: chunk })
                    commentsSendedCounter += chunk.length
                })
                await Promise.all(messagePromises)
                return await GuildSchema.updateOne({ Guild: guild.id, Pairs: { $elemMatch: { discordChannel: pair.discordChannel, youtubeChannel: pair.youtubeChannel } } }, { "Pairs.$[].date": new Date() })
            })
        })
        return await Promise.allSettled(pairPromises).finally(async () => {
            if (commentsSendedCounter) await GuildSchema.updateOne({ Guild: obj.Guild }, { "$inc": { "Stats.Sended": commentsSendedCounter } })
        })
    })
    const results = await Promise.all(guildPromises)
    results.forEach((guild) => {
        guild.filter(guild => guild.status === 'rejected').forEach(pair => {
            console.log(pair.reason)
        })
    })
}