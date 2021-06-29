exports.run = async (client, message, Discord, [...value]) => { // eslint-disable-line no-unused-vars

  try { // Put your Code Here.
    value = value.join(" ");
    if (!value || value.length > 150) return message.inlineReply("Please provide meeting text, make it's not 150+ characters long.", { allowedMentions: { repliedUser: false } }); 

    const embed = client.util.BaseEmbed(message)
    .setColor(client.color.none)
    .setImage(encodeURI(`https://vacefron.nl/api/emergencymeeting?text=${value}`))

    return message.channel.send(embed);
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "meeting",
  description: "Return a Among us image.",
  examples: [],
  usage: ["<text>"],
  type: []
};

exports.conf = {
  aliases: ["stks"],
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
