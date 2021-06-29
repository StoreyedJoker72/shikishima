const schedule = require(`${process.cwd()}/storage/getNextEpisode.js`);
 
exports.run = async (client, message, Discord, [...value]) => { // eslint-disable-line no-unused-vars
  
  try { // Put your Code below. 
  let anime = value.join(" ");
    const command = value[0] ? value[0].toLowerCase() : "";
    switch (command) {
      case "dm":
          schedule(anime, message, true);
        break;
      default:
          schedule(anime, message);
        break;
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "anime-when",
  description: "Checks the next episode time/countdown for anime",
  examples: ["one piece"],
  usage: ["<(title|keyword)>"],
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