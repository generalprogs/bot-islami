const { Events, Interaction, EmbedBuilder ,InteractionType } = require('discord.js');
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isChatInputCommand()) {
	    if(interaction.user.bot) return;
	     let client = interaction.client;
		const command = interaction.client.slashcommands.get(interaction.commandName);
	    
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
    }
  }
}