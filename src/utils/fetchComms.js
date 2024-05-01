const youtube = require('@googleapis/youtube')
const { api } = require("../context")

const ytclient = youtube.youtube(api)

module.exports = async (channelId) => {
    let comments = await ytclient.commentThreads.list({ allThreadsRelatedToChannelId: channelId, part: ['snippet'], order: 'time', maxResults: 100, textFormat: 'plaintext' })
    return comments.data.items
        .map(({ snippet }) => {
            const comment = snippet.topLevelComment
            return {
                id: comment.id,
                date: new Date(comment.snippet.publishedAt),
                content: comment.snippet.textDisplay,
                authorName: comment.snippet.authorDisplayName,
                authorPic: comment.snippet.authorProfileImageUrl,
                authorLink: comment.snippet.authorChannelUrl,
                vidId: comment.snippet.videoId
            }
        })
}