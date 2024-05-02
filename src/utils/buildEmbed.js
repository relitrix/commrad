const { EmbedBuilder, escapeMarkdown } = require("discord.js");

module.exports = ({ title, date, content, authorName, authorPic, authorLink, vidThumbnail, vidLink, creator }) => {
    return new EmbedBuilder({
        author: { name: authorName ? escapeMarkdown(authorName) : null, iconURL: authorPic || null, url: authorLink || null },
        description: escapeMarkdown(content),
        thumbnail: { url: vidThumbnail || null },
        title: title ? escapeMarkdown(title) : null,
        url: vidLink || null,
        timestamp: date || null,
        footer: { text: creator.name || null, iconURL: creator.pic || null }
    })
        .setColor("ff0000")

}