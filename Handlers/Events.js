async function loadEvents(client) {
  const chalk = require("chalk")
  const { loadFiles } = require("../Functions/fileLoader");
  client.events.clear();

  const Files = await loadFiles("./Events");

  Files.forEach((file) => {
    const event = require(file);
    if (!event.name) return;

    const execute = (...args) => event.execute(...args, client);
    if (event.once) client.once(event.name, execute);
    else client.on(event.name, execute);

    client.events.set(event.name, execute);
  });
}

module.exports = { loadEvents };
