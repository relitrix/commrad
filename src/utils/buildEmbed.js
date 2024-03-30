const { EmbedBuilder } = require("discord.js");

module.exports = ({ title, date, content, authorName, authorPic, authorLink, vidThumbnail, vidLink, creator }) => {
    return new EmbedBuilder({
        author: { name: authorName || null, iconURL: authorPic || null, url: authorLink || null },
        description: content,
        thumbnail: { url: vidThumbnail || null },
        title: title || null,
        url: vidLink || null,
        timestamp: date || null,
        footer: { text: creator.name || null, iconURL: creator.pic || null }
    })
        .setColor("ff0000")

}