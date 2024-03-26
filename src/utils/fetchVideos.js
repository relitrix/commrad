module.exports = async (channelId, pages = 1) => {
    /**
     * @type {Innertube}
     */
    const youtube = process.youtube
    const channel = await youtube.getChannel(channelId)
    let videos = await channel.getVideos()
    let vids = videos.videos.map(video => video.id)
    let page = 1
    while (videos.has_continuation && page <= pages) {
        videos = await videos.getContinuation()
        vids = [].concat(vids, videos.videos.map(video => video.id))
        page++
    }
    return vids
}