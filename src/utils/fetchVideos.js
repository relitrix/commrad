const youtube = require('@googleapis/youtube')

const ytclient = youtube.youtube({version: 'v3', auth: process.env.YOUTUBE_KEY })

module.exports = async (ids) => {
    const videos = await ytclient.videos.list({ id: ids, part: ['id', 'snippet'] })
    const result = new Map()
    videos.data.items
        .forEach(({ id, snippet }) => {
            if (!id || !snippet) {
                return;
            }
            return result.set(id, snippet)
        })
    return result;
}