const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");


module.exports ={

    data: new SlashCommandBuilder()
    .setName('بنج')
    .setDescription('تجربة سرعة البوت'),
    async execute(interaction, client) {
        const sent = await interaction.reply({ content: 'التجربة...', fetchReply: true });
	    let embed1 = new EmbedBuilder()
        .setColor('#f1d68c')
        .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
        .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
	    .setTitle(`**سرعتي : \`${sent.createdTimestamp - interaction.createdTimestamp}\`ملي ثانية**`)
		return interaction.editReply({content : `` , embeds:[embed1]})
 
    }
}