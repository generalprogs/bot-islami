const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, ChannelType } = require("discord.js");
const { Database } = require('st.db')
const nikatDB = new Database('/database/nikatDB.json')

module.exports ={
    data: new SlashCommandBuilder()
    .setName('نقاطي')
    .setDescription('لإظهار نقاطك 🔸'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const Points = nikatDB.get(`points_${interaction.user.id}`) || 0
        const embed = new EmbedBuilder()
                                .setTitle(`عدد نقاطك : ${Points}🔸`)
                                .setDescription(`### > يمكنك تجميع اكثر نقاط عن طريق امر \`+سؤال\``)
                                .setColor('#f1d68c')
                                .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })

        interaction.reply({embeds : [embed]})
    }
}