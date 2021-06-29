const fetch = require("node-fetch");

exports.run = async (client, message, Discord) => {
  try { // Put your Code below.

    const qoutes = await fetch(
        "https://api.quotable.io/random"
    ).then((res) => res.json());

    const embed = client.util.BaseEmbed(message)
    .setDescription(await client.functions.translate(message, qoutes.content));

    return message.channel.send({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "qoutes",
  description: "Get a qoutes",
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