const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, ChannelType } = require("discord.js");
const { Database } = require('st.db')
const edhaaDB = new Database('/database/edhaaDB.json')

module.exports ={

    data: new SlashCommandBuilder()
    .setName('إذاعة')
    .setDescription('لتفعيل الاذاعة 24 ساعة في روم معينة 📻')
    .addChannelOption(option => option.setName('الروم').setDescription('تحديد روم الاذاعة الصوتية').setRequired(true).addChannelTypes(ChannelType.GuildVoice)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has('Administrator')) return interaction.reply({content : `لا تمتلك صلاحية لاستخدام هذا الامر` , ephemeral : true});
        const channel = interaction.options.getChannel('الروم');
        await edhaaDB.set(`edhaa_${interaction.guild.id}` , channel.id)
        interaction.reply(`** تم تحديد ${channel} كروم لاذاعة القران الكريم 🕌 **`)
    }
}