const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('End a giveaway early.')
        .addIntegerOption(option => option.setName('giveawayid').setDescription('The ID of the giveaway').setRequired(true)),
    async execute(interaction) {
        const giveawayId = interaction.options.getInteger('giveawayid');

        // Check if the giveaway exists
        if (!giveawayData[giveawayId]) {
            return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
        }

        const giveaway = giveawayData[giveawayId];

        // Check if the giveaway has already ended
        if (giveaway.ended) {
            return interaction.reply({ content: 'This giveaway has already ended.', ephemeral: true });
        }

        // End the giveaway
        giveaway.ended = true; // Mark as ended
        let winners = [];

        // Randomly select winners from the entries
        let winnerIds = Array.from(giveaway.entries);
        for (let i = 0; i < Math.min(giveaway.numberOfWinners, winnerIds.length); i++) {
            let winnerIndex = Math.floor(Math.random() * winnerIds.length);
            winners.push(`<@${winnerIds[winnerIndex]}>`);
            winnerIds.splice(winnerIndex, 1); // Remove the winner to avoid duplicates
        }

        giveaway.winners = winners; // Save winners

        // Update the giveaway embed
        const giveawayEmbed = new EmbedBuilder()
            .setColor(giveaway.color)
            .setTitle(giveaway.prize)
            .setDescription(`${giveaway.description}\n\nEnded: <t:${giveaway.endTimestamp}:F>\nHosted by: <@${giveaway.host}>\nEntries: **${giveaway.entries.size}**\nWinners: ${winners.join(', ')}`)
            .setTimestamp();

        // Find the original giveaway message and edit it
        const message = await interaction.channel.messages.fetch(giveaway.messageId);
        if (message) {
            await message.edit({ embeds: [giveawayEmbed], components: [] }); // Disable components if needed
        }

                await interaction.reply({ content: `The giveaway has been ended. Congratulations to the winners: ${winners.join(', ')}!` });
            
        }
    };