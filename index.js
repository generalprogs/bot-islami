const { Client, Collection, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, roleMention, ModalBuilder, TextInputBuilder , TextInputStyle , ComponentType} = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent , GatewayIntentBits.GuildVoiceStates], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
require('dotenv').config()
const { Routes } = require('discord-api-types/v10');
const { prefix , owner } = require(`./config.json`)
const { Database } = require("st.db")
const azkarDB = new Database('/database/azkarDB.json')
const meshafDB = new Database('/database/meshafDB.json')
const asilaaDB = new Database('/database/asilaa.json');
const nikatDB = new Database('/database/nikatDB.json')
const azkar = require('azkar')
const {startServer} = require("./alive.js")
startServer();
const token = process.env.TOKEN;
client.login(token).catch(err => console.log('❌ Token are not working'));
client.commandaliases = new Collection()
const rest = new REST({ version: '10' }).setToken(token);
module.exports = client;
//-
client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashcommands },
            );
        } catch (error) {
            console.error(error);
        }
    console.log(`Done set everything`);
	console.log(`Developer : gp.dark , Developer ID : 792370035238371329`)
	console.log(`All rights reserved Due to widespread theft and sale without licenses, to remove rights from the code, contact the developer in Discord`)
})
//
client.slashcommands = new Collection()
const slashcommands = [];
 const ascii = require('ascii-table');
const table = new ascii('Commands').setJustify();
for (let folder of readdirSync('./commands/').filter(folder => !folder.includes('.'))) {
  for (let file of readdirSync('./commands/' + folder).filter(f => f.endsWith('.js'))) {
	  let command = require(`./commands/${folder}/${file}`);
	  if(command) {
		  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
		  if(command.data.name) {
			  table.addRow(`/${command.data.name}` , '🟢 Working')
		  }
		  if(!command.data.name) {
			  table.addRow(`/${command.data.name}` , '🔴 Not Working')
		  }
	  }
  }
}
console.log(table.toString())


//event-handler
readdirSync('./events').forEach(async file => {
	const event = await require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})



//nodejs-events
process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })


/**
 * @title : كود الاذكار
 * @desc: بامكانك تغيير الوقت الفاصل بين كل ذكر يُرسل
 * @desc : تغيير 000_600 باي مدة اخرى بالملي ثانية
 */
setInterval(async() => {
	const allValues = await azkarDB.valuesAll();
	allValues.forEach(async(roomId) => {
		const room = client.channels.cache.get(roomId)
		if(room){
			let result = await azkar.random();
			const embed = new EmbedBuilder()
									.setColor('#f1d68c')
									.setTitle(`${result.category}`)
									.setDescription(`** ### ${result.zekr} **`)
									.setFooter({text : `اَلْإِسْلَام دِينَنَا` , iconURL :'https://tvforyou.sirv.com/Images/kaaba.png'})
									.setThumbnail(client.user.avatarURL({dynamic : true}));
			await room.send({embeds : [embed]})
		}
	})
}, 600000);


/**
 * @title : التفاعلات مع ازرار المصحف
 */
client.on("interactionCreate" , async(interaction) => {
	if(interaction.customId == `meshaf_awl_${interaction.user.id}`){
		const receivedEmbed = interaction.message.embeds[0];
		const updatedEmbed = new EmbedBuilder(receivedEmbed)
		.setImage('http://www.islamicbook.ws/2/1.jpg')
		.setDescription(`### الصفحة : الأولى`);
		const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                        .setCustomId(`meshaf_awl_${interaction.user.id}`)
                        .setEmoji('⏮')
                        .setLabel('اول صفحة')
                        .setStyle(ButtonStyle.Secondary)
						.setDisabled(true),

            new ButtonBuilder()
                        .setCustomId(`meshaf_sebak_${interaction.user.id}`)
                        .setEmoji('◀️')
                        .setLabel('الصفحة السابقة')
                        .setStyle(ButtonStyle.Primary)
						.setDisabled(true),

            new ButtonBuilder()
                        .setCustomId(`meshaf_mouayana_${interaction.user.id}`)
                        .setEmoji('💡')
                        .setLabel('صفحة معينة')
                        .setStyle(ButtonStyle.Success)
						.setDisabled(false),

            new ButtonBuilder()
                        .setCustomId(`meshaf_telya_${interaction.user.id}`)
                        .setEmoji('▶️')
                        .setLabel('الصفحة التالية')
                        .setStyle(ButtonStyle.Primary)
						.setDisabled(false),

            new ButtonBuilder()
                        .setCustomId(`meshaf_ekher_${interaction.user.id}`)
                        .setEmoji('⏭')
                        .setLabel('اخر صفحة')
                        .setStyle(ButtonStyle.Secondary)
						.setDisabled(false),
        )
		interaction.update().catch(async() => {})
		await meshafDB.set(`pageNumber_${interaction.user.id}` , 0);
		interaction.message.edit({embeds : [updatedEmbed] , components : [row]});
	}else if(interaction.customId == `meshaf_ekher_${interaction.user.id}`){
		const receivedEmbed = interaction.message.embeds[0];
		const updatedEmbed = new EmbedBuilder(receivedEmbed)
		.setImage('http://www.islamicbook.ws/2/604.jpg')
		.setDescription(`### الصفحة : الأخيرة`);
		const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                        .setCustomId(`meshaf_awl_${interaction.user.id}`)
                        .setEmoji('⏮')
                        .setLabel('اول صفحة')
                        .setStyle(ButtonStyle.Secondary)
						.setDisabled(false),
            new ButtonBuilder()
                        .setCustomId(`meshaf_sebak_${interaction.user.id}`)
                        .setEmoji('◀️')
                        .setLabel('الصفحة السابقة')
                        .setStyle(ButtonStyle.Primary)
						.setDisabled(false),

            new ButtonBuilder()
                        .setCustomId(`meshaf_mouayana_${interaction.user.id}`)
                        .setEmoji('💡')
                        .setLabel('صفحة معينة')
                        .setStyle(ButtonStyle.Success)
						.setDisabled(false),

            new ButtonBuilder()
                        .setCustomId(`meshaf_telya_${interaction.user.id}`)
                        .setEmoji('▶️')
                        .setLabel('الصفحة التالية')
                        .setStyle(ButtonStyle.Primary)
						.setDisabled(true),

            new ButtonBuilder()
                        .setCustomId(`meshaf_ekher_${interaction.user.id}`)
                        .setEmoji('⏭')
                        .setLabel('اخر صفحة')
                        .setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
        )
		interaction.update().catch(async() => {})
		await meshafDB.set(`pageNumber_${interaction.user.id}` , 604);
		interaction.message.edit({embeds : [updatedEmbed] , components : [row]})
	}else if(interaction.customId == `meshaf_mouayana_${interaction.user.id}`){
		const modal = new ModalBuilder()
								.setTitle('اختر الصفحة')
								.setCustomId(`sendModalMeshaf`);
		const input = new TextInputBuilder()
								.setLabel('رقم الصفحة')
								.setCustomId('safhaNumber')
								.setStyle(TextInputStyle.Short)
								.setPlaceholder('0-604');
		const row = new ActionRowBuilder()
								.addComponents(input)
		modal.addComponents(row)
		await interaction.showModal(modal);
	}else if(interaction.customId == `sendModalMeshaf`){
		const safhaNumber = interaction.fields.getTextInputValue('safhaNumber')
		if(safhaNumber >= 0 && safhaNumber <= 604){
			if(safhaNumber == 0){
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : الأولى`)
				.setImage(`https://images-ext-1.discordapp.net/external/UjRWekazEYa0L_mXFmIQ5i8YrYj2srY31SHwfHvC0qQ/https/www.noor-book.com/publice/covers_cache_webp/1/9/d/3/619d96042c9d3c774d877c40e4e4b194.png.webp?format=webp&width=342&height=500`);
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
								.setCustomId(`meshaf_awl_${interaction.user.id}`)
								.setEmoji('⏮')
								.setLabel('اول صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true),
					new ButtonBuilder()
								.setCustomId(`meshaf_sebak_${interaction.user.id}`)
								.setEmoji('◀️')
								.setLabel('الصفحة السابقة')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(true),
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
				interaction.reply({content : `تم تغيير الصفحة الى ${safhaNumber}` , ephemeral : true})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , 0);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}else if (safhaNumber == 604) {
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : الأخيرة`)
				.setImage(`http://www.islamicbook.ws/2/604.jpg`);
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
								.setStyle(ButtonStyle.Primary)
								.setDisabled(true),
					new ButtonBuilder()
								.setCustomId(`meshaf_ekher_${interaction.user.id}`)
								.setEmoji('⏭')
								.setLabel('اخر صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true),
				)
				interaction.reply({content : `تم تغيير الصفحة الى ${safhaNumber}` , ephemeral : true})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , 604);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}else{
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : ${safhaNumber}`)
				.setImage(`http://www.islamicbook.ws/2/${safhaNumber}.jpg`);
				interaction.reply({content : `تم تغيير الصفحة الى ${safhaNumber}` , ephemeral : true})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , parseInt(safhaNumber));
				return interaction.message.edit({ embeds : [updatedEmbed]})
			}
		}else{
			return interaction.reply({content : `يرحى تحديد  صفحة بين 0 و 604` , ephemeral : true})
		}
	}else if(interaction.customId == `meshaf_telya_${interaction.user.id}`){
		const pageNumber = meshafDB.get(`pageNumber_${interaction.user.id}`); // رقم الصفحة المخزنة
		const newPage = pageNumber + 1; // رقم الصفحة الجديدة
			if(newPage >= 604){ // مافماش بعد اخر صفحة
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : الأخيرة`)
				.setImage(`http://www.islamicbook.ws/2/604.jpg`);
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
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),
					new ButtonBuilder()
								.setCustomId(`meshaf_mouayana_${interaction.user.id}`)
								.setEmoji('💡')
								.setLabel('صفحة معينة')
								.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
								.setCustomId(`meshaf_telya_${interaction.user.id}`)
								.setEmoji('▶️')
								.setLabel('الصفحة التالية')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(true),
					new ButtonBuilder()
								.setCustomId(`meshaf_ekher_${interaction.user.id}`)
								.setEmoji('⏭')
								.setLabel('اخر صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true),
				)
				interaction.reply({content : `تم تغيير الصفحة الى 604` , ephemeral : true})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , 604);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}else{ //
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : ${newPage}`)
				.setImage(`http://www.islamicbook.ws/2/${newPage}.jpg`);
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
								.setCustomId(`meshaf_awl_${interaction.user.id}`)
								.setEmoji('⏮')
								.setLabel('اول صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_sebak_${interaction.user.id}`)
								.setEmoji('◀️')
								.setLabel('الصفحة السابقة')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),
					new ButtonBuilder()
								.setCustomId(`meshaf_mouayana_${interaction.user.id}`)
								.setEmoji('💡')
								.setLabel('صفحة معينة')
								.setStyle(ButtonStyle.Success)
								.setDisabled(false),
					new ButtonBuilder()
								.setCustomId(`meshaf_telya_${interaction.user.id}`)
								.setEmoji('▶️')
								.setLabel('الصفحة التالية')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_ekher_${interaction.user.id}`)
								.setEmoji('⏭')
								.setLabel('اخر صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),
				)

				await interaction.update().catch(async() => {})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , newPage);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}
		
	}else if(interaction.customId == `meshaf_sebak_${interaction.user.id}`){
		const pageNumber = meshafDB.get(`pageNumber_${interaction.user.id}`); // رقم الصفحة المخزنة
		const newPage = pageNumber - 1; // رقم الصفحة الجديدة
			if(newPage <= 0){
				let image = `http://www.islamicbook.ws/2/${newPage}.jpg`;
				if(pageNumber == 1) image = "https://www.noor-book.com/publice/covers_cache_webp/1/9/d/3/619d96042c9d3c774d877c40e4e4b194.png.webp"
	
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : ${newPage}`)
				.setImage(image);
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
								.setCustomId(`meshaf_awl_${interaction.user.id}`)
								.setEmoji('⏮')
								.setLabel('اول صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_sebak_${interaction.user.id}`)
								.setEmoji('◀️')
								.setLabel('الصفحة السابقة')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(true),

					new ButtonBuilder()
								.setCustomId(`meshaf_mouayana_${interaction.user.id}`)
								.setEmoji('💡')
								.setLabel('صفحة معينة')
								.setStyle(ButtonStyle.Success)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_telya_${interaction.user.id}`)
								.setEmoji('▶️')
								.setLabel('الصفحة التالية')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_ekher_${interaction.user.id}`)
								.setEmoji('⏭')
								.setLabel('اخر صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),
				)

				await interaction.update().catch(async() => {})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , newPage);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}else{
				let image = `http://www.islamicbook.ws/2/${newPage}.jpg`;
				if(pageNumber == 1) image = "https://www.noor-book.com/publice/covers_cache_webp/1/9/d/3/619d96042c9d3c774d877c40e4e4b194.png.webp"
	
				const receivedEmbed = interaction.message.embeds[0];
				const updatedEmbed = new EmbedBuilder(receivedEmbed)
				.setDescription(`### الصفحة : ${newPage}`)
				.setImage(image);
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
								.setCustomId(`meshaf_awl_${interaction.user.id}`)
								.setEmoji('⏮')
								.setLabel('اول صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_sebak_${interaction.user.id}`)
								.setEmoji('◀️')
								.setLabel('الصفحة السابقة')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_mouayana_${interaction.user.id}`)
								.setEmoji('💡')
								.setLabel('صفحة معينة')
								.setStyle(ButtonStyle.Success)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_telya_${interaction.user.id}`)
								.setEmoji('▶️')
								.setLabel('الصفحة التالية')
								.setStyle(ButtonStyle.Primary)
								.setDisabled(false),

					new ButtonBuilder()
								.setCustomId(`meshaf_ekher_${interaction.user.id}`)
								.setEmoji('⏭')
								.setLabel('اخر صفحة')
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(false),
				)

				await interaction.update().catch(async() => {})
				await meshafDB.set(`pageNumber_${interaction.user.id}` , newPage);
				return interaction.message.edit({ embeds : [updatedEmbed] , components : [row]})
			}
		
	}
})

/**
 * @title : امر الأسئلة
 * @usage : سؤال // +تحدي+
 */

client.on('messageCreate', async message => {
    if (message.content === '+سؤال' || message.content === "+تحدي") {
		let click = false;
        const questions = asilaaDB.get('questions');
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        const embed = new EmbedBuilder()
            .setColor('#f1d68c')
            .setTitle(`اِخْتَبَرَ ثَقَافَتَكَ اَلدِّينِيَّةَ 🎯`)
            .setDescription(`### ${randomQuestion.question_text}`)
            .setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
            .setThumbnail(client.user.avatarURL({ dynamic: true }));

        const row = new ActionRowBuilder()
            .addComponents(
                randomQuestion.choices.map((choice, index) =>
                    new ButtonBuilder()
                        .setCustomId(`choice_${index}`)
                        .setLabel(choice)
                        .setStyle(ButtonStyle.Secondary)
                )
            );

        const messageSent = await message.reply({ embeds: [embed], components: [row] });

        const filter = (i) => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ componentType: ComponentType.Button, filter, time: 10000 });

        collector.on('collect', async interaction => {
			click = true;
            const choiceIndex = parseInt(interaction.customId.split('_')[1]);
            if (choiceIndex === randomQuestion.correct_choice_index) {
				await row.components.forEach(button => button.setDisabled(true));
                await row.components[randomQuestion.correct_choice_index].setStyle(ButtonStyle.Success);
				await messageSent.edit({ components: [row] });
				await nikatDB.add(`points_${interaction.user.id}` , 1)
				await interaction.reply('👳🏼‍♂️ أَحْسَنَتْ إِجَابَةً صَحِيحَةً');
            } else {
				row.components.forEach(button => button.setDisabled(true));
                await row.components[choiceIndex].setStyle(ButtonStyle.Danger);
				await messageSent.edit({ components: [row] });
                await interaction.reply('👶🏻 اَلْإِجَابَة خَاطِئَةٌ لِلْأَسَفِ');
            }
			collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0 && !click) {
                row.components.forEach(button => button.setDisabled(true));
                messageSent.edit({ components: [row] });
				messageSent.reply('⌛ اِنْتَهَى اَلْوَقْتُ');
            }
        });
    }
});


client.on("messageCreate" , async(message) => {
	if(message.content == "+توب"){
        const userData = nikatDB.all().filter(data => data.ID.startsWith("points_"));

        userData.sort((a, b) => b.data - a.data);

        const leaderboardEmbed = new EmbedBuilder()
            .setTitle('قائمة متصدري النقاط')
            .setColor('#f1d68c')
			.setFooter({ text: `اَلْإِسْلَام دِينَنَا`, iconURL: 'https://tvforyou.sirv.com/Images/kaaba.png' })
            .setThumbnail(client.user.avatarURL({ dynamic: true }));

        // Get usernames and points for the top users
		let description = "";
        for (let i = 0; i < Math.min(userData.length, 10); i++) {
            const userId = userData[i].ID.replace("points_", "");
            const user = await client.users.fetch(userId);
            if (user) {
				description += `**#${i + 1} <@${userId}> \`-\` ${userData[i].data}🔸**\n`;
            }
        }
		leaderboardEmbed.setDescription(`${description}`)
				message.reply({embeds : [leaderboardEmbed]})
	}
})

