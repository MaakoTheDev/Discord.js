const {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const { loadCommands } = require("../../Handlers/Commands");
const { loadEvents } = require("../../Handlers/Events");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload Commands or Events")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Select what to reload")
        .setRequired(true)
        .addChoices(
          { name: "Events", value: "events" },
          { name: "Commands", value: "commands" }
        )
    ),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const reloadType = interaction.options.getString("type");

    // Read the config.json file to get the owner and developer arrays
    const configPath = path.join(__dirname, "../../config.json");
    const config = JSON.parse(fs.readFileSync(configPath));

    const { Owner, Developers, DevGuild, LogChannel } = config;
    const Logs = client.channels.cache.get(LogChannel);

    switch (reloadType) {
      case "events":
        // Remove all event listeners before reloading
        for (const [key, value] of client.events) {
          client.removeListener(key, value);
        }

        // Send the log message if the Logs channel is available
        if (Logs) {
          Logs.send({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: client.user.tag,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setColor("2F3136")
                .setTimestamp()
                .setFooter({
                  text: interaction.user.username,
                  value: interaction.user.displayAvatarURL()
                })
                .setThumbnail(client.user.displayAvatarURL())
                .addFields({
                  name: "Event's loaded",
                  value: `<t:${parseInt(
                    interaction.createdTimestamp / 1000
                  )}:F>`,
                }),
            ],
          });
        }

        loadEvents(client);
        interaction.reply({
          content: "**Event's Loaded**",
        });
        break;

      case "commands":
        // Check if the user is an Owner or Developer to proceed
        if (
          !Owner.includes(interaction.user.id) &&
          !Developers.includes(interaction.user.id)
        ) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `\\📛 **Error:** \\📛\n Sorry, You can't use that command!`
                )
                .setColor("Red"),
            ],
            ephemeral: true,
          });
        }

        // Send the log message if the Logs channel is available
        if (Logs) {
          Logs.send({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: client.user.tag,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setColor("2F3136")
                .setThumbnail(client.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({
                  text: interaction.user.username,
                  value: interaction.user.displayAvatarURL()
                })
                .addFields({
                  name: "Commands's loaded",
                  value: `<t:${parseInt(
                    interaction.createdTimestamp / 1000
                  )}:F>`,
                }),
            ],
          });
        }

        loadCommands(client);
        interaction.reply({
          content: "**Commands Loaded**",
        });
        break;

      default:
        interaction.reply({
          content: "Invalid reload option. Use either 'events' or 'commands'.",
        });
        break;
    }
  },
};
