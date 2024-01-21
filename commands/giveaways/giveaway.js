const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const ms = require('ms');

let giveaways = [];
let giveawayData = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create a giveaway!')
        .addStringOption(option => option.setName('prize').setDescription('The prize for the giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners for the giveaway').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('The time for the giveaway (e.g., 1s, 1m, 1h, 1d)').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('The description for the giveaway').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const prize = interaction.options.getString('prize');
        const numberOfWinners = interaction.options.getInteger('winners');
        const durationMinutes = interaction.options.getString('time');
        const description = interaction.options.getString('description') || '';

        // Unique giveaway ID
        const giveawayId = Date.now(); // Using the current timestamp as a simple unique ID
        giveaways.push(giveawayId);
        giveawayData[giveawayId] = { host: interaction.user.id, entries: new Set(), prize, winners: [], color: 0xFFFF38 };

        // Parsing time
        const duration = ms(interaction.options.getString('time'));
        if (!duration) {
            return interaction.reply({ content: 'Invalid time format provided.', ephemeral: true });
        }
        
        const endTime = new Date(Date.now() + duration);
        const endTimestamp = Math.floor(endTime.getTime() / 1000);

        let entries = new Set();

        const host = interaction.user;
        const hostedBy = `Hosted by: <@${host.id}>`;

        const giveawayEmbed = new EmbedBuilder()
            .setColor(0xFFFF38)
            .setTitle(`${prize}`)
            .setDescription(`${description}\n\nEnds In: <t:${endTimestamp}:R> (<t:${endTimestamp}:F>)\n${hostedBy}\nEntries: **${entries.size}**\nWinners: None Yet `)
            .setTimestamp();

        const enterButton = new ButtonBuilder()
            .setCustomId('enter_giveaway')
            .setLabel('Enter Giveaway')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(enterButton);

        await interaction.reply({ embeds: [giveawayEmbed], components: [row] });

        const filter = i => i.customId === 'enter_giveaway';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: durationMinutes * 60 * 1000 });

        collector.on('collect', async i => {
            if (i.customId === 'enter_giveaway') {
                entries.add(i.user.id);
                giveawayEmbed.setDescription(`${description}\n\nEnds In: <t:${endTimestamp}:R> (<t:${endTimestamp}:F>)\n${hostedBy}\nEntries: **${entries.size}**\nWinners: None Yet `);
                await i.update({ embeds: [giveawayEmbed], components: [row] });
            }
        });

        collector.on('end', async () => {
            let winnerIds = Array.from(entries);
            let winners = [];

            // Randomly select winners
            for (let i = 0; i < Math.min(numberOfWinners, winnerIds.length); i++) {
                let winnerIndex = Math.floor(Math.random() * winnerIds.length);
                winners.push(`<@${winnerIds[winnerIndex]}>`);
                winnerIds.splice(winnerIndex, 1); // Remove the winner to avoid duplicates
            }

            // Create the Giveaway Summary button
            const summaryButton = new ButtonBuilder()
                .setLabel('Giveaway Summary')
                .setStyle(ButtonStyle.Link)
                .setURL('https://youtube.com'); // Replace with your actual URL

            const summaryRow = new ActionRowBuilder().addComponents(summaryButton);

            giveawayEmbed.setDescription(`${description}\n\nEnded: <t:${endTimestamp}:F>\n${hostedBy}\nEntries: **${entries.size}**\nWinners: ${winners.join(', ')}`);
            await interaction.editReply({ embeds: [giveawayEmbed], components: [summaryRow] }); // Update the original message with the summary button

            await interaction.followUp({ content: `Congratulations ${winners.join(', ')}! You won **${prize}**!`});
        });
    },
}