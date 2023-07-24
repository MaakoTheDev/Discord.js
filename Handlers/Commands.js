const { Client } = require("discord.js");
const { DevGuild } = require("../config.json");
const { loadFiles } = require("../Functions/fileLoader");
const chalk = require("chalk");

/**
 *
 * @param {Client} client
 */
async function loadCommands(client) {
  await client.commands.clear();

  let commandsArray = [];
  let developerArray = [];

  const Files = await loadFiles("Commands");

  Files.forEach((file) => {
    const command = require(file);

    if (command.subCommand) {
      return client.subCommands.set(command.subCommand, command);
    }

    if (!command.data.name)
      return console.error(`Command: ${file} doesn't have a name`);
    client.commands.set(command.data.name, command);

    if (command.developer) {
      developerArray.push(command.data.toJSON());
    } else {
      commandsArray.push(command.data.toJSON());
    }
  });
  client.application.commands.set(commandsArray);

  if (DevGuild) {
    const devGuildId = DevGuild[0]; // Fetch the first element of the array
    try {
      const developerGuild = client.guilds.cache.get(devGuildId);
      if (developerGuild) {
        developerGuild.commands.set(developerArray);
        console.log(chalk.default.red("[/] Developer Guild Commands Loaded"));
      } else {
        console.log(
          `The specified Developer Guild ID (${devGuildId}) is invalid, or the bot is not a member of that guild. Please check the 'DevGuild' value in the config.json file.`
        );
      }
    } catch (error) {
      console.error(
        `Error occurred while fetching Developer Guild: ${error.message}`
      );
    }
  } else {
    console.log(
      `Please set a Developer Guild Id in .env to enable Developer Guild Only Commands.`
    );
  }

  console.log(chalk.default.red("[/] Commands Loaded"));
}

module.exports = { loadCommands };
