const figlet = require("figlet");

exports.run = async (client, message, Discord, [...ascii]) => {
  try { // Put your Code below.

    ascii = ascii.join(" ");
    if (!ascii) ascii = await client.functions.awaitReply(message, "what message would you like me to say?");
    if (!ascii) return;

    const bigtext = figlet.textSync(ascii, {
      font: "Big",
      horizontalLayout: "universal smushing",
      verticalLayout: "universal smushing"
    })
    return message.channel.send(`\`\`\`${bigtext}\`\`\``);
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "ascii",
  description: "say something cringy...",
  examples: [],
  usage: ["<text>"],
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