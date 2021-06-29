const Random = require("srod-v2");

exports.run = async (client, message, Discord, [member]) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, member, { current: true });
  if (!member.id) return;// message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
    const embed = await Random.ChangeMyMind({ Message: Value, Color: client.color.none });
    return message.channel.send(embed);
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "changemymind",
  description: "Return a change my mind image.",
  examples: [],
  usage: ["<@member>"],
  type: []
};

exports.conf = {
  aliases: ["cmm"],
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
