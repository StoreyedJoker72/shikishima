const pkg = require("../../../package.json");

exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.

    const dependencies = Object.entries(pkg.dependencies).join(",\n");

    const embed = client.util.BaseEmbed(message)
    .setTitle(await client.functions.translate(message, "Dependencies"))
    .setDescription(dependencies);

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } })
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "dependencies",
  description: "Shows a list of all bots dependencies",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: [],
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