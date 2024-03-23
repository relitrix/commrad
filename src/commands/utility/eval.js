const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const clean = async (text) => {
    if (text && text.constructor.name == "Promise")
        text = await text;

    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    return text;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Eval any JS code.')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('Code to eval.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        if (interaction.user.id !== process.env.DEV_ID) {
            await interaction.reply({ content: 'Nope\nhttps://media1.tenor.com/m/1HOfGCrKQLMAAAAC/sans-undertale.gif', ephemeral: true });
            return;
        }

        const code = interaction.options.getString('code');

        let msg
        try {
            const evaled = eval(code);
            const cleaned = (await clean(evaled)).substring(0, 1900);

            msg = `\`\`\`js\n${cleaned}\n\`\`\``
        } catch (err) {
            const cleaned = (await clean(err)).substring(0, 1900);
            msg = `\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``
        }

        await interaction.reply({ content: msg, ephemeral: true });
    },
};
