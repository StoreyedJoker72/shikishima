exports.run = async (client, message, Discord, [...say]) => {
  try { // Put your Code below.

    say = say.join(" ");
    if (!say) say = await client.functions.awaitReply(message, "what message would you like me to say?");
    if (!say) return;

  return message.channel.send(await client.functions.translate(message, client.util.shorten(say)));
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "say",
  description: "say something cringy...",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["s"],
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