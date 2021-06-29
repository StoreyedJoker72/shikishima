const fetch = require('node-fetch');


exports.run = async (client, message, Discord) => {
  try { // Put your Code below.

    const data = await fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.inlineReply(`Server Error 5xx: Advice API is currently down!`, { allowedMentions: { repliedUser: false } });
    };

    return message.inlineReply(data.slip.advice, { allowedMentions: { repliedUser: false } })
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "advice",
  description: "Generate a random useless advice",
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