const {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    Client,
  } = require("discord.js");
  const { Color } = require("../../config.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("🏓 Pong")
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        interaction.reply({
            content: `**Ping - ${client.ws.ping}ms**`
        })
    },
  };
  