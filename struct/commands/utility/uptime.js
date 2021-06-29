const moment = require("moment");
require("moment-duration-format");

//const os = require('os');
//${Math.round((os.totalmem() - os.freemem()) / 10000000)}/${Math.round(os.totalmem() / 10000000)}mb
exports.run = async (client, message, Discord) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.
    const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    return message.inlineReply(`Uptime: ${uptime} with ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB of ram usage!`, { allowedMentions: { repliedUser: false } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "uptime",
  description: "Get bot uptime.",
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
  user: [],
};
