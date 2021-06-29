const fetch = require("node-fetch"),
moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, Discord, [pkg]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!pkg) pkg = await client.functions.awaitReply(message, `What package am i supposed to show you?`);
    if (!pkg) return;

    const res = await fetch(`https://registry.npmjs.com/${pkg}`).catch(() => null);
    if (res.status === 404) return message.channel.send(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    const body = await res.json();

      const version = body.versions[body["dist-tags"].latest];

      let deps = version.dependencies ? Object.keys(version.dependencies) : null;
      let maintainers = body.maintainers.map((user) => user.name);

      if(maintainers.length > 10) {
        const len = maintainers.length - 10;
        maintainers = maintainers.slice(0, 10);
        maintainers.push(`...${len} more.`);
      }

      if(deps && deps.length > 10) {
        const len = deps.length - 10;
        deps = deps.slice(0, 10);
        deps.push(`...${len} more.`);
      }
    const embed = client.util.BaseEmbed(message)
    .setTitle(await client.functions.translate(message, body.name))
    .setURL(`https://www.npmjs.com/package/${body.name}`)
		.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
    .setDescription(await client.functions.translate(message, body.description || "No description."))
    .addField("❯ " + await client.functions.translate(message, "Version"), body["dist-tags"].latest, true)
    .addField("❯ " + await client.functions.translate(message, "License"), body.license || "None", true)
    .addField("❯ " + await client.functions.translate(message, "Author"), body.author ? body.author.name : "???", true)
    .addField("❯ " + await client.functions.translate(message, "Creation Date"), moment.utc(body.time.created).format("YYYY/MM/DD hh:mm:ss"), true)
    .addField("❯ " + await client.functions.translate(message, "Modification Date"), body.time.modified ? moment.utc(body.time.modified).format("YYYY/MM/DD hh:mm:ss") : "None", true)
    if(body.repository)embed.addField("❯ " + await client.functions.translate(message, "Repository"), body.repository ? `[View Here](${body.repository.url.split("+")[1]})` : "None", true)
    .addField("❯ " + await client.functions.translate(message, "Maintainers"), client.util.trimArray(body.maintainers.map(user => user.name), 10).join(", "));

    return message.channel.send({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "npm",
  description: "Search the NPM Registry for a package information.",
  examples: ["npm discord.js"],
  usage: ["<package>"],
  type: []
};

exports.conf = {
  aliases: ["npmpackage", "npmpkg", "nodepackagemanager"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: [],
  user: []
};