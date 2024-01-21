const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { giveawayData } = require('./giveawaystorage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveawaylist')
        .setDescription('Lists all active giveaway IDs.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const activeGiveaways = Object.entries(giveawayData)
            .filter(([id, data]) => !data.ended)
            .map(([id]) => id);
        
        const giveawayListEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Active Giveaways')
            .setDescription(activeGiveaways.length > 0 ? activeGiveaways.join('\n') : 'No active giveaways at the moment.')
            .setTimestamp();

        await interaction.reply({ embeds: [giveawayListEmbed] });
    },
};
