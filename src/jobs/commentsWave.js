module.exports = async () => {
    const { GuildSchema } = process.mongo
    const client = process.disClient
    const fetchVideos = require('../utils/fetchVideos')
    const fetchComms = require('../utils/fetchComms')


    const guildAndPair = await GuildSchema.find({ Pairs: { $exists: true, $not: { $size: 0 } } }, { Guild: 1, Pairs: 1 })

    guildAndPair.forEach(async (obj) => {
        try {
            const guild = await client.guilds.fetch(obj.Guild)
            obj.Pairs.forEach(async pair => {
                const discordChannel = await guild.channels.fetch(pair.discordChannel)
                const vids = await fetchVideos(pair.youtubeChannel, 1)
                console.log(pair.youtubeChannel, vids.length)
                vids.forEach(async vid => {
                    fetchComms(vid).then(result => {
                        if (!result.length) return
                        const newComms = result.filter(comm => comm.date > pair.date)
                        if (!newComms.length) return

                    })
                })

            })
        } catch (e) {
            return console.error(e)
        }
    })
}