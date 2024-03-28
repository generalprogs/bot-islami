const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");

const client = require("../..");
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('تغيير-الاسم')
    .setDescription('تغيير اسم البوت')
    .addStringOption(Option => 
        Option
        .setName('الاسم')
        .setDescription('اضافة اسم البوت الجديد')
        .setRequired(true)),
async execute(interaction) {
    if (!owner.includes(interaction.user.id)) return
    const name = interaction.options.getString('الاسم')

    await client.user.setUsername(`${name}`)
        let embed1 = new EmbedBuilder()
        .setColor('#f1d68c')
        .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
        .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
	    .setTitle(`**تم تغيير اسم البوت الى : \`${name}\`**`)
    interaction.reply({empheral:false , embeds:[embed1]})

}
}