const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gsetcolor')
        .setDescription('Set the color of a giveaway embed.')
        .addIntegerOption(option => option.setName('giveawayid').setDescription('The ID of the giveaway').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('The color to set the embed to').setRequired(true)),
    async execute(interaction) {
        const giveawayId = interaction.options.getInteger('giveawayid');
        const color = interaction.options.getString('color');

        // Check if the giveaway exists
        if (!giveawayData[giveawayId]) {
            return interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
        }

        // Set the color
        giveawayData[giveawayId].color = parseInt(color.replace('#', ''), 16);
        return interaction.reply({ content: `The color for giveaway ${giveawayId} has been set to ${color}.`, ephemeral: true });
    },
};