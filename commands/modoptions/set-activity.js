const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");

const client = require("../..");
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('تغيير-الحالة')
    .setDescription('تغيير حالة و نشاط البوت')
    .addStringOption(Option => 
        Option
        .setName('حالة')
        .setDescription('تغيير حالة البوت')
	    .addChoices(
            { name: 'idle', value: 'idle' },
            { name: 'online', value: 'online' },
            { name: 'dnd', value: 'dnd' },)
        .setRequired(true)) // or false
	.addStringOption(Option => 
        Option
        .setName('نشاط')
        .setDescription('تغيير نشاط البوت')
        .setRequired(true)),
async execute(interaction , client) {
    if (!owner.includes(interaction.user.id)) return;
	const status = interaction.options.getString("حالة")
	let activity = interaction.options.getString("نشاط")
	await client.user.setStatus(`${status}`)
	await client.user.setActivity(`${activity}`)
	let embed1 = new EmbedBuilder()
    .setColor('#f1d68c')
    .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
    .setThumbnail(client.user.avatarURL({ dynamic: true }))
	.setTitle(`**تم تغيير الحالة الى : \`${status}\` , النشاط الى : \`${activity}\`**`)
	 interaction.reply({empheral:false , embeds:[embed1]})
}
}