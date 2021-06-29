exports.run = async (client, message, Discord, [member, ...reasons]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to mute?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    if(member.id === message.author.id) return message.inlineReply("`🚫` Why would you mute yourself?", { allowedMentions: { repliedUser: false } });
    if(member.id === client.user.id) return message.inlineReply("`🚫` Why would you mute me?", { allowedMentions: { repliedUser: false } });
    if(member.id === message.guild.ownerID) return message.inlineReply("`🚫` You can't mute the owner.", { allowedMentions: { repliedUser: false } });

    if(member.roles.cache.find((r) => r.name === "muted")) return message.inlineReply("`🚫` This user is already muted.", { allowedMentions: { repliedUser: false } });
    if(member.roles.highest.position >= message.member.roles.highest.position) return message.inlineReply("`🚫` You cannot mute this user.", { allowedMentions: { repliedUser: false } });
    if(member.hasPermission("MANAGE_ROLES")) return message.inlineReply("`🚫` I cannot mute this user.", { allowedMentions: { repliedUser: false } });

    let reasone = reasons.join(" ");
    if (!reasone) reasone = await client.functions.awaitReply(message, `Tell me your reason, why you want to mute him?`);

    const options = {};
    let reason = reasone ? reasone : null;
    if(reason) options.reason = reason;

    const mutedRole = await client.findOrCreateMutedRole(message.guild);
    client.updateMuteChannelPerms(message.guild, member.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false,
      CONNECT: false,
    });

    member.roles.add(mutedRole);

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.moderation`);
    let channel = await client.util.searchChannel(message, setting);

    const avatar = message.author.displayAvatarURL({
      dynamic: true
    });
    const embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
    .setTitle(`\`🔇\` __Member muted in #${message.channel.name}__`)
    .setDescription([
      `**❯ Target** • ${member.user.tag} (${member.id})`,
      `**❯ Issued by** • ${message.author.tag} (${message.author.id})`,
      `**❯ Reason** • ${reason ? reason : "Not Specified"}`
    ].join("\n"))
    .setColor(client.color.orange)
    .setFooter(`Moderation system powered by ${client.user.username}`, client.user.displayAvatarURL)
    .setTimestamp();

    if(!(setting) || !(channel)) {
      message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    } else {
      channel.send(embed);
    }

    member.send(`You were muted by staff in the **${message.guild.name}** server for the reason "${reason ? reason : "Not Specified"}".\nPlease ensure you follow all the rules of the server in the future to avoid this occurring again.`);
    //message.inlineReply(`\`🔇\` ${member.user.tag} has been muted.`, { allowedMentions: { repliedUser: false } })

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "mute",
  description: "Mute a member, so annoying.",
  examples: ["mute @Nekoyasui stfu"],
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
  bot: ["MUTE_MEMBERS"],
  user: ["MUTE_MEMBERS"]
};