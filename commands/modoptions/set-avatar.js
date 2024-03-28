const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");

const client = require("../../index.js");
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('تغيير-الافتار')
    .setDescription('تغيير صورة البوت')
    .addStringOption(Option => 
        Option
        .setName('رابط')
        .setDescription('اضافة رابط الصورة')
        .setRequired(true)),
async execute(interaction) {
    if (!owner.includes(interaction.user.id)) return
    const url = interaction.options.getString('رابط')

     await client.user.setAvatar(`${url}`)
 let embed1 = new EmbedBuilder()
        .setColor('#f1d68c')
        .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
        .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
	    .setTitle(`**تم تغيير الافتار**`)
	.setImage(`${url}`)
	
    interaction.reply({embeds:[embed1], ephemeral: false})


}
}