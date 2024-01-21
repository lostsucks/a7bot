const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const { giveawayData } = require('./giveawaystorage'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveawayend')
        .setDescription('End a giveaway early.')
        .addIntegerOption(option => option.setName('giveawayid').setDescription('The ID of the giveaway').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const giveawayId = interaction.options.getInteger('giveawayid');

        if (!giveawayData[giveawayId]) {
            return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
        }

        const giveaway = giveawayData[giveawayId];

        if (giveaway.ended) {
            return interaction.reply({ content: 'This giveaway has already ended.', ephemeral: true });
        }

        giveaway.ended = true; // Mark as ended
        let winners = [];

        let winnerIds = Array.from(giveaway.entries);
        for (let i = 0; i < Math.min(giveaway.numberOfWinners, winnerIds.length); i++) {
            let winnerIndex = Math.floor(Math.random() * winnerIds.length);
            winners.push(`<@${winnerIds[winnerIndex]}>`);
            winnerIds.splice(winnerIndex, 1); 
        }

        giveaway.winners = winners; 

        const giveawayEmbed = new EmbedBuilder()
            .setColor(giveaway.color)
            .setTitle(giveaway.prize)
            .setDescription(`${giveaway.description}\n\nEnded: <t:${giveaway.endTimestamp}:F>\nHosted by: <@${giveaway.host}>\nEntries: **${giveaway.entries.size}**\nWinners: ${winners.join(', ')}`)
            .setTimestamp();

        const message = await interaction.channel.messages.fetch(giveaway.messageId);
        if (message) {
            await message.edit({ embeds: [giveawayEmbed], components: [] }); // Disable components if needed
        }

                await interaction.reply({ content: `The giveaway has been ended. Congratulations to the winners: ${winners.join(', ')}!` });
            
        }
    };