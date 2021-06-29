exports.run = async (client, message, Discord, [member]) => {
  member = await client.util.searchMember(message, member, { current: true });
  if (!member.id) return;// message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code below.

    const clientAuthor = member.id === message.client.user.id;
    const size = clientAuthor ? message.author.id : member.id.slice(-3) % 20 + 1;

    message.inlineReply(`\`${size} cm\` 8${'='.repeat(size)}D 💦💦💦`, { allowedMentions: { repliedUser: false } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "pee-pee",
  description: "Guess your pp size..",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["penis", "smolpp", "pp"],
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