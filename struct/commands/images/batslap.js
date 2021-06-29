exports.run = async (client, message, Discord, [member, ...value]) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, member, { current: true });
  if (!member.id) return;// message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  value = value.join(" ") || "Don't be gay";
  if(value.length > 50) return message.inlineReply("Characters limit reached - 50.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
		message.channel.send(new Discord.MessageAttachment(encodeURI(`https://vacefron.nl/api/batmanslap?text1=bruh&text2=${value}&batman=${message.author.displayAvatarURL({size: 4096, format: "png"})}&robin=${member.user.displayAvatarURL({size: 4096, format: "png"})}`), `${member.user.username}_slap.png`));
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "slap",
  description: "Return a slap image.",
  examples: [],
  usage: ["<@member>"],
  type: []
};

exports.conf = {
  aliases: ["batmanslap", "slp"],
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
