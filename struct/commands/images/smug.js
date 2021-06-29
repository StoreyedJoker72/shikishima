const Random = require("srod-v2");

exports.run = async (client, message, Discord) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.
    const embed = await Random.GetAnimeImage({ Anime: "smug", Color: client.color.none });
    return message.channel.send(embed);
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "smug",
  description: "Return a random smug.",
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
  client: [],
  user: [],
};
