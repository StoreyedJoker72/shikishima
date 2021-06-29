exports.run = async (client, message, Discord, [member, nickname]) => {
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to change nickname?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
		if (member.id === client.user.id) return message.inlineReply('`🚫` Please don\'t nickname me...!', { allowedMentions: { repliedUser: false } });
		if (member.id === message.author.id) return message.inlineReply('`🚫` I wouldn\'t dare nickname you...!', { allowedMentions: { repliedUser: false } });
		if (member.roles.highest.position > message.member.roles.highest.position - 1) return message.inlineReply(`\`🚫\` You can't nickname **${member.user.username}**! Their position is higher than you!`, { allowedMentions: { repliedUser: false } });
		if (!member.bannable) return message.inlineReply(`\`🚫\` I can't nickname **${member.user.username}**! Their role is higher than mine!`, { allowedMentions: { repliedUser: false } });

    if (!nickname) nickname = await client.functions.awaitReply(message, `Please provide me a nickname to assign!`);
    if (!nickname) return;

		return await nickname !== 'clear' ? member.setNickname(nickname).then(() => message.inlineReply(`\`🍇\` The nickname **${nickname}** has been assigned to **${member.user.username}**!`)) : member.setNickname('').then(() => message.inlineReply(`\`🍇\` **${member.displayName}**'s nickname has been cleared!`, { allowedMentions: { repliedUser: false } }));

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "nickname",
  description: 'Assigns a nickname to a member! Use "clear" or leave it blank to remove the nickname!',
  examples: ["nickname @Nekoyasui Welp"],
  usage: ["<@member>", "<nickname>"],
  type: []
};

exports.conf = {
  aliases: ["nick"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: ["MANAGE_NICKNAME", "CHANGE_NICKNAME"],
  user: ["MANAGE_NICKNAME", "CHANGE_NICKNAME"]
};