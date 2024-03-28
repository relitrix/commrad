const { EmbedBuilder } = require("discord.js");

module.exports = ({ title, date, content, authorName, authorPic, authorLink, vidThumbnail, vidLink }) => {
    return new EmbedBuilder({
        author: { name: authorName || null, iconURL: authorPic || null, url: authorLink || null },
        color: "#ff0000",
        description: content,
        thumbnail: { url: vidThumbnail || null },
        title: title || null,
        url: vidLink || null,
        timestamp: date || null
    })

}