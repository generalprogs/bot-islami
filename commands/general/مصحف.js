const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require('st.db')
const meshafDB = new Database('/database/meshafDB.json')

module.exports ={

    data: new SlashCommandBuilder()
    .setName('مصحف')
    .setDescription('لقراءة المصحف الشريف 🕋')
    .addStringOption(option => option.setName('الصفحة').setDescription('قراءة صفحة معينة من المصحف بين 0 و 604').setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const safha = interaction.options.getString('الصفحة');
        if(safha){
            if(safha >= 0 && safha <= 604){
                const embed = new EmbedBuilder()
                            .setTitle('مصحف القران الكريم')
                            .setDescription(`### الصفحة : ${safha}`)
                            .setColor('#f1d68c')
                            .setImage(`http://www.islamicbook.ws/2/${safha}.jpg`)
                            .setFooter({text : `اَلْإِسْلَام دِينَنَا` , iconURL :'https://tvforyou.sirv.com/Images/kaaba.png'})
                const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                        .setCustomId(`meshaf_awl_${interaction.user.id}`)
                        .setEmoji('⏮')
                        .setLabel('اول صفحة')
                        .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                        .setCustomId(`meshaf_sebak_${interaction.user.id}`)
                        .setEmoji('◀️')
                        .setLabel('الصفحة السابقة')
                        .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                        .setCustomId(`meshaf_mouayana_${interaction.user.id}`)
                        .setEmoji('💡')
                        .setLabel('صفحة معينة')
                        .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                        .setCustomId(`meshaf_telya_${interaction.user.id}`)
                        .setEmoji('▶️')
                        .setLabel('الصفحة التالية')
                        .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                        .setCustomId(`meshaf_ekher_${interaction.user.id}`)
                        .setEmoji('⏭')
                        .setLabel('اخر صفحة')
                        .setStyle(ButtonStyle.Secondary),
                )
                await meshafDB.set(`pageNumber_${interaction.user.id}` , safha);
                interaction.reply({embeds : [embed] , components : [row]})
            }else{
                interaction.reply({content : `يرجى تحديد صفحة بين 0 و 604` , ephemeral : true})
            }
        }else{
            const pageNumber = meshafDB.get(`pageNumber_${interaction.user.id}`);
            let image;
            if(pageNumber) image = `http://www.islamicbook.ws/2/${pageNumber}.jpg`
            if(!pageNumber) image = `https://www.noor-book.com/publice/covers_cache_webp/1/9/d/3/619d96042c9d3c774d877c40e4e4b194.png.webp`
            if(!pageNumber) meshafDB.set(`pageNumber_${interaction.user.id}` , 0);
    
            const embed = new EmbedBuilder()
                                    .setTitle('مصحف القران الكريم')
                                    .setDescription(`### الصفحة : ${pageNumber || 0}`)
                                    .setColor('#f1d68c')
                                    .setImage(image)
                                    .setFooter({text : `اَلْإِسْلَام دِينَنَا` , iconURL :'https://tvforyou.sirv.com/Images/kaaba.png'})
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                            .setCustomId(`meshaf_awl_${interaction.user.id}`)
                            .setEmoji('⏮')
                            .setLabel('اول صفحة')
                            .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                            .setCustomId(`meshaf_sebak_${interaction.user.id}`)
                            .setEmoji('◀️')
                            .setLabel('الصفحة السابقة')
                            .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                            .setCustomId(`meshaf_mouayana_${interaction.user.id}`)
                            .setEmoji('💡')
                            .setLabel('صفحة معينة')
                            .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                            .setCustomId(`meshaf_telya_${interaction.user.id}`)
                            .setEmoji('▶️')
                            .setLabel('الصفحة التالية')
                            .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                            .setCustomId(`meshaf_ekher_${interaction.user.id}`)
                            .setEmoji('⏭')
                            .setLabel('اخر صفحة')
                            .setStyle(ButtonStyle.Secondary),
            )
            interaction.reply({embeds : [embed] , components : [row]})
        }
    }
}