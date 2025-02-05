const { EmbedBuilder, escapeMarkdown } = require("discord.js");
const truncateString = require('./truncString')

module.exports = ({ title, date, content, authorName, authorPic, authorLink, vidThumbnail, vidLink, creator }) => {
    return new EmbedBuilder({
        author: { name: authorName ? truncateString(escapeMarkdown(authorName), 256) : null, iconURL: authorPic || null, url: authorLink || null },
        description: truncateString(escapeMarkdown(content), 4096),
        thumbnail: { url: vidThumbnail || null },
        title: title ? truncateString(escapeMarkdown(title), 256) : null,
        url: vidLink || null,
        timestamp: date || null,
        footer: { text: truncateString(creator.name, 2048) || null, iconURL: creator.pic || null }
    })
        .setColor("ff0000")

}