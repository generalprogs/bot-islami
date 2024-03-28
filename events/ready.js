const { Client , Events, ActivityType} = require('discord.js');
const { Database } = require('st.db');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const {sendClient} = require('../alive')

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        client.user.setStatus('online');
        console.log(`Ready! Logged in as ${client.user.tag}, My ID: ${client.user.id}`);
        let activities = [`اَلْإِسْلَام دِينَنَا`, `لا إله إلا الله، وحدَه لا شريكَ له، له الملكُ وله الحَمدُ، وهو على كل شيءٍ قديرٌ`, `اَللَّهُمَّ اِجْعَلْ رَمَضَانْ فَاتِحَةَ خَيْرٍ عَلَى اَلْأُمَّةِ اَلْإِسْلَامِيَّةِ`];
        await sendClient(`${client.user.username}` , `${client.user.avatarURL({dynamic : true})}`)
        let i = 0;
        setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 5000);
        const edhaaDB = new Database('/database/edhaaDB.json');
        setInterval(async () => {
            const values = edhaaDB.valuesAll();
            values.forEach(async (roomid) => {
                const channel = await client.channels.fetch(roomid);
                if (channel) {
                    try {
                            const connection = joinVoiceChannel({
                                channelId: channel.id,
                                guildId: channel.guild.id,
                                adapterCreator: channel.guild.voiceAdapterCreator,
                            });
                            const player = createAudioPlayer();
                            const resource = createAudioResource("https://backup.qurango.net/radio/ahmed_altrabulsi");
                            player.play(resource);
                            connection.subscribe(player);
                    } catch (error) {
                        console.error('Error occurred while attempting to play audio:', error);
                    }
                } else {
                    console.log("Sorry, error fetching channel.");
                }
            });
        }, 5_000);
    },
};
