exports.run = async (client, message, Discord, [member, ...reasons]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to ban?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    if(member.id === message.author.id) return message.inlineReply("`❌` Why would you ban yourself?", { allowedMentions: { repliedUser: false } });
    if(member.id === client.user.id) return message.inlineReply("`❌` Why would you ban me?");
    if(member.id === message.guild.ownerID) return message.inlineReply("`❌` You can't ban the owner.", { allowedMentions: { repliedUser: false } });

    if(member.roles.highest.position >= message.member.roles.highest.position) return message.inlineReply("`❌` You cannot ban this user.", { allowedMentions: { repliedUser: false } });
    if(!member.bannable || member.hasPermission("BAN_MEMBERS")) return message.inlineReply("`❌` I cannot ban this user.", { allowedMentions: { repliedUser: false } });

    let reasone = reasons.join(" ");
    if (!reasone) reasone = await client.functions.awaitReply(message, `Tell me your reason, why you want to ban him?`);

    const options = {};
    let reason = reasone ? reasone : null;
    if(reason) options.reason = reason;

    await member.ban(options);

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.moderation`);
    let channel = await client.util.searchChannel(message, setting);

    const lastMessage = message.guild.member(member).lastMessageID;
    const embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
    .setTitle(`\`🔨\` __Member banned from ${message.guild.name}__`)
    .setDescription([
      `**❯ Target** • ${member.user.tag} (${member.id})`,
      `**❯ Issued by** • ${message.author.tag} (${message.author.id})`,
      `**❯ Reason** • ${reason ? reason : "Not Specified"}`,
      `**❯ Last message** • ${lastMessage ? $lastMessage : "Not Specified"}`
    ].join("\n"))
    .setColor(client.color.orange)
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
  name: "ban",
  description: "Ban a member, ofcourse its really good.",
  examples: ["ban @Nekoyasui really annoying.."],
  usage: ["<@member>", "[reason]"],
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