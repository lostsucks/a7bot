const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { giveawayData } = require('./giveawaystorage'); // Adjust the path accordingly

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveawaylist')
        .setDescription('Lists all active giveaway IDs.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        // Fetch the active giveaway IDs
        const activeGiveaways = Object.entries(giveawayData)
            .filter(([id, data]) => !data.ended)
            .map(([id]) => id);
        
        // Create an embed with the list of giveaway IDs
        const giveawayListEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Active Giveaways')
            .setDescription(activeGiveaways.length > 0 ? activeGiveaways.join('\n') : 'No active giveaways at the moment.')
            .setTimestamp();

        // Reply with the embed
        await interaction.reply({ embeds: [giveawayListEmbed] });
    },
};
