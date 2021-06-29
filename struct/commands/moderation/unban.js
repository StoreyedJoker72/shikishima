exports.run = async (client, message, Discord, [member]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to unban?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    if (!member) return message.inlineReply("`❌` Mention an valid member.", { allowedMentions: { repliedUser: false } });
    const banned = await message.guild.members.unban(member);
    if(!banned) return message.inlineReply("`❌` This user is not banned on this server.", { allowedMentions: { repliedUser: false } });

    let reasone = reasons.join(" ");
    if (!reasone) reasone = await client.functions.awaitReply(message, `Tell me your reason, why you want to unban him?`);

    const options = {};
    let reason = reasone ? reasone : null;
    if(reason) options.reason = reason;

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.moderation`);
    let channel = await client.util.searchChannel(message, setting);

    const avatar = message.author.displayAvatarURL({
      dynamic: true
    });
    const embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
    .setTitle(`\`🔨\` __Member banned from ${message.guild.name}__`)
    .setDescription([
      `**❯ User** • ${member.user.tag} (${member.id})`,
      `**❯ Unbanned by** • ${message.author.tag} (${message.author.id})`,
      `**❯ Reason** • ${reason ? reason : "Not Specified"}`
    ].join("\n"))
    .setColor(client.color.green)
    .setFooter(`Moderation system powered by ${client.user.username}`, client.user.displayAvatarURL)
    .setTimestamp();

    if(!(setting) || !(channel)) {
      message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    } else {
      channel.send(embed);
    }

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "unban",
  description: "Unban a member, god has been forgiven him.",
  examples: ["ban @Nekoyasui"],
  usage: ["<@member>"],
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
  bot: ["BAN_MEMBERS"],
  user: ["BAN_MEMBERS"]
};