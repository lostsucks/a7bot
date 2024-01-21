const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('The IP of our servers and how to use them!'),
    async execute(interaction) {
        const ipEmbed = new EmbedBuilder()
            .setColor(0xFFFF38)
            .setTitle(`Our Server IP's!`)
            //.setDescription(`**Java Edition:**\n\`orionrealms.net\`\n\`play.kyotocraft.net\`\n\`play.synthplex.net\'\n\`ogorion.minehut.gg\`\n\n**Bedrock Edition:**\n\`bedrock.orionrealms.net\`\n\`bedrock.ogorion.minehut.gg\``)
            .setTimestamp()
            .addFields(
                { name: 'Java Edition', value: '`a7box.minehut.gg`', inline: true },
                { name: 'Bedrock Edition', value: '`bedrock.a7box.minehut.gg`', inline: true },
            );

        await interaction.reply({ embeds: [ipEmbed] });
    },
};