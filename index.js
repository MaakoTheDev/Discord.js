const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
require("dotenv").config();

const { GuildMessages, GuildMessageReactions, Guilds, MessageContent } = GatewayIntentBits; // Add Guilds to the intents
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMessages, GuildMessageReactions, MessageContent], // Include Guilds intent here
  partials: [User, Message, GuildMember, ThreadMember],
});

client.setMaxListeners(15);

const { loadEvents } = require("./Handlers/Events");

client.events = new Collection();
client.commands = new Collection();
client.config = require("./config.json");

(async () => {
  await loadEvents(client);

  client.login(process.env.Token);
})();
