const { hasNitro, probablyHasNitro, isBoosting } = require("discord-premium-utils");

exports.run = async (client, message, Discord, [option, member]) => {
  try { // Put your Code below.
    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });

		const checkMethod = option ? option.toLowerCase() : "";
		switch(checkMethod) { 
			case "nitro":
        if (hasNitro(member.id)) {
            return message.inlineReply("You have nitro!", { allowedMentions: { repliedUser: false } });
        } else if (probablyHasNitro(member)) {
            return message.inlineReply("You probably have nitro!", { allowedMentions: { repliedUser: false } });
        } else {
            return message.inlineReply("You probably don't have nitro!", { allowedMentions: { repliedUser: false } });
        }
			case "booster":
        if (isBoosting(member)) {
            return message.inlineReply("You are server boosting!", { allowedMentions: { repliedUser: false } });
        } else {
            return message.inlineReply("You are probably not server boosting!", { allowedMentions: { repliedUser: false } });
        }
		}
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "check",
  description: "Check members status on current server.",
  examples: [],
  usage: ["<option(nitro|booster)>", "<@member>"],
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