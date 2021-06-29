exports.run = async (client, message, Discord, [member]) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, member, { current: true });
  if (!member) return;// message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
    const embed = client.util.BaseEmbed(message)
    .setColor(client.color.none)
    .setImage(encodeURI(`https://vacefron.nl/api/stonks?user=${member.user.displayAvatarURL({size: 4096, format: "png"})}`))

    return message.channel.send(embed);
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "stonks",
  description: "Return a stonks image.",
  examples: [],
  usage: ["<@member>"],
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
