const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require('st.db')
const azkarDB = new Database('/database/azkarDB.json')

module.exports ={

    data: new SlashCommandBuilder()
    .setName('اذكار')
    .setDescription('لنشر اذكار في روم معينه كل 10 دقائق 🕌')
    .addChannelOption(option => option.setName('الروم').setDescription('تحديد روم الاذكار').setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has('Administrator')) return interaction.reply({content : `لا تمتلك صلاحية لاستخدام هذا الامر` , ephemeral : true});
        const channel = interaction.options.getChannel('الروم');
        await azkarDB.set(`azkarroom_${interaction.guild.id}` , channel.id)
        interaction.reply(`** تم تحديد ${channel} كروم لنشر الاذكار 🕌 **`)
    }
}