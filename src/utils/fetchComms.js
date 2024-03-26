const chrono = require('chrono-node');

module.exports = async (videoId, pages) => {
    const youtube = process.youtube
    let comments = await youtube.getComments(videoId, "NEWEST_FIRST")
    let comms = []
    let page = 1
    do {
        page++
        comms = [].concat(comms, comments.contents
            .filter(thread => !thread.comment.author_is_channel_owner)
            .map(thread => {
                return {
                    id: thread.comment.comment_id,
                    date: chrono.parseDate(thread.comment.published.text.replace('(edited)', '')),
                    content: thread.comment.content.text,
                    authorName: thread.comment.author.name,
                    authorPic: thread.comment.author.thumbnails[0].url
                }
            }))
        if (comments.has_continuation && page <= pages) {
            comments = await comments.getContinuation()
        }
    } while (comments.has_continuation && page <= pages)
    return comms
}