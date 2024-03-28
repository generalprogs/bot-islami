const { ChatInputCommandInteraction , Client ,SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, ChannelType } = require("discord.js");
const { Database } = require('st.db')
const { getPrayerTimes } = require('islamic-library');

module.exports ={
    data: new SlashCommandBuilder()
    .setName('اوقات-الصلاة')
    .setDescription('لإظهار مواقيت لجميع الدول العربية ⌚')
    .addStringOption(option => option.setName('الدولة').setDescription('يرجى اختيار الدولة').addChoices(
        {name : 'الأردن' , value : 'ordon'},
        {name : 'الامارات' , value : 'imarat'},
        {name : 'البحرين' , value : 'bahrin'},
        {name : 'الجزائر' , value : 'gazeir'},
        {name : 'السعودية' , value : 'saoudia'},
        {name : 'السودان' , value : 'soudan'},
        {name : 'العراق' , value : 'iraq'},
        {name : 'الكويت' , value : 'kouait'},
        {name : 'المغرب' , value : 'maghrib'},
        {name : 'اليمن' , value : 'yamn'},
        {name : 'تونس' , value : 'tounes'},
        {name : 'سوريا' , value : 'sourya'},
        {name : 'عمان' , value : 'aman'},
        {name : 'فلسطين' , value : 'flstin'},
        {name : 'قطر' , value : 'qatar'},
        {name : 'لبنان' , value : 'lbnan'},
        {name : 'ليبيا' , value : 'libya'},
        {name : 'مصر' , value : 'masr'},
        {name : 'موريتانيا' , value : 'mouritanya'},
    ).setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const dawla = interaction.options.getString('الدولة')
        let latitude;
        let longitude;
        if(dawla == "ordon"){
            latitude = 31.9454;
            longitude = 35.9284; // Jordan
        } else if(dawla == "imarat"){
            latitude = 24.4539;
            longitude = 54.3773; // UAE
        } else if(dawla == "bahrin"){
            latitude = 25.9304;
            longitude = 50.6377; // Bahrain
        } else if(dawla == "gazeir"){
            latitude = 28.0339;
            longitude = 1.6596; // Algeria
        } else if(dawla == "saoudia"){
            latitude = 23.8859;
            longitude = 45.0792; // Saudi Arabia
        } else if(dawla == "soudan"){
            latitude = 12.8628;
            longitude = 30.2176; // Sudan
        } else if(dawla == "iraq"){
            latitude = 33.2232;
            longitude = 43.6793; // Iraq
        } else if(dawla == "kouait"){
            latitude = 29.3759;
            longitude = 47.9774; // Kuwait
        } else if(dawla == "maghrib"){
            latitude = 31.7917;
            longitude = 7.0926; // Morocco
        } else if(dawla == "yamn"){
            latitude = 15.5527;
            longitude = 48.5164; // Yemen
        } else if(dawla == "tounes"){
            latitude = 33.8869;
            longitude = 9.5375; // Tunisia
        } else if(dawla == "sourya"){
            latitude = 34.8021;
            longitude = 38.9968; // Syria
        } else if(dawla == "aman"){
            latitude = 23.6143;
            longitude = 58.5453; // Oman
        } else if(dawla == "flstin"){
            latitude = 31.9539;
            longitude = 35.9106; // Palestine
        } else if(dawla == "qatar"){
            latitude = 25.3548;
            longitude = 51.1839; // Qatar
        } else if(dawla == "lbnan"){
            latitude = 33.8547;
            longitude = 35.8623; // Lebanon
        } else if(dawla == "libya"){
            latitude = 26.3351;
            longitude = 17.2283; // Libya
        } else if(dawla == "masr"){
            latitude = 26.8206;
            longitude = 30.8025; // Egypt
        } else if(dawla == "mouritanya"){
            latitude = 21.0079;
            longitude = 10.9408; // Mauritania
        }

        function convertTimeTo12HourFormat(time24) {
            let [hours, minutes] = time24.split(':');
            let period = hours >= 12 ? 'م' : 'ص';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${period}`;
        }


        getPrayerTimes(latitude, longitude).then(prayerTimes => {
            const timings = prayerTimes.data.timings;
            const date = prayerTimes.data.date.hijri;
            const formattedTimings = {};
            for (const [key, value] of Object.entries(timings)) {
                formattedTimings[key] = convertTimeTo12HourFormat(value);
            }
            const embed = new EmbedBuilder()
                .setTitle(`مواقيت الصلاة ليوم ${date.weekday.ar} الموافق ل ${date.day} ${date.month.ar} ${date.year}`)
                .setColor('#f1d68c')
                .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
                .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
                .setDescription(`\`\`\`إِنَّ اَلصَّلَاةَ كَانَتْ عَلَى اَلْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا\`\`\``)
                .addFields(
                    { name: 'الفجر', value: formattedTimings.Fajr, inline: true },
                    { name: 'الشروق', value: formattedTimings.Sunrise, inline: true },
                    { name: `\n`, value: `\n`, inline: true },
                    { name: 'الظهر', value: formattedTimings.Dhuhr, inline: true },
                    { name: 'العصر', value: formattedTimings.Asr, inline: true },
                    { name: `\n`, value: `\n`, inline: true },
                    { name: 'المغرب', value: formattedTimings.Maghrib, inline: true },
                    { name: 'الإمساك', value: formattedTimings.Imsak, inline: true },
                    { name: `\n`, value: `\n`, inline: true },
                    { name: 'العشاء', value: formattedTimings.Isha, inline: true },
                );
            interaction.reply({ embeds: [embed] });
        }).catch(err => {
            console.error(err);
            interaction.reply('حدثت مشكلة أثناء جلب مواقيت الصلاة.');
        });
    }
}