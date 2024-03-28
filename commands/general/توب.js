const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, ChannelType } = require("discord.js");
const { Database } = require('st.db')
const nikatDB = new Database('/database/nikatDB.json')

module.exports ={
    data: new SlashCommandBuilder()
    .setName('توب')
    .setDescription('لإظهار أكثر مسلمين متحصلين على نقاط 🏆'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
                const userData = nikatDB.all().filter(data => data.ID.startsWith("points_"));
                if(userData.length <= 0){
                    const leaderboardEmbed = new EmbedBuilder()
                    .setTitle('قائمة متصدري النقاط')
                    .setDescription('** لا وجود لقائمة متصدرين حاليا **')
                    .setColor('#f1d68c')
                    .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
                    .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }));
                    return interaction.reply({embeds : [leaderboardEmbed]})
                }else{
                    userData.sort((a, b) => b.data - a.data);
        
                    const leaderboardEmbed = new EmbedBuilder()
                        .setTitle('قائمة متصدري النقاط')
                        .setColor('#f1d68c')
                        .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
                        .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }));
            
                    let description = "";
                    for (let i = 0; i < Math.min(userData.length, 10); i++) {
                        const userId = userData[i].ID.replace("points_", "");
                        const user = await interaction.client.users.fetch(userId);
                        if (user) {
                            description += `**#${i + 1} <@${userId}> \`-\` ${userData[i].data}🔸**\n`;
                        }
                    }
                    leaderboardEmbed.setDescription(`${description}`)
                    interaction.reply({embeds : [leaderboardEmbed]})
                }
    }
}