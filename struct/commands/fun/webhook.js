exports.run = async (client, message, Discord, [...content]) => {
  let member = await client.util.searchMember(message, message.author.id);
  if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code below.
    await client.util.sendWebhook(message, content, { username : member.user.username, avatar : member.user.displayAvatarURL({size: 4096, dynamic: true })});
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "webhook",
  description: "Return a webhook",
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