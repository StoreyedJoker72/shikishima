exports.run = async (client, message, Discord, [member, ...reasons]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to unmute?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.channel.send("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    if(!member.roles.cache.find((r) => r.name === "muted")) return message.channel.send("`❌` This user is not muted.", { allowedMentions: { repliedUser: false } });

    let reasone = reasons.join(" ");
    if (!reasone) reasone = await client.functions.awaitReply(message, `Tell me your reason, why you want to unmute him?`);

    const options = {};
    let reason = reasone ? reasone : null;
    if(reason) options.reason = reason;

    const mutedRole = await client.findOrCreateMutedRole(message.guild);
    message.guild.channels.cache.forEach((channel) => {
      channel.permissionOverwrites.get(member.id).delete();
    });

    member.roles.remove(mutedRole);

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.moderation`);
    let channel = await client.util.searchChannel(message, setting);

    const avatar = message.author.displayAvatarURL({
      dynamic: true
    });
    const embed = new Discord.MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
    .setTitle(`\`🔊\` __Member unmuted__`)
    .setDescription([
      `**❯ User** • ${member.user.tag} (${member.id})`,
      `**❯ Unmuted by** • ${message.author.tag} (${message.author.id})`,
      `**❯ Reason** • ${reason ? reason : "Not Specified"}`
    ].join("\n"))
    .setColor(client.color.green)
    .setFooter(`Moderation system powered by ${client.user.username}`, client.user.displayAvatarURL)
    .setTimestamp();

    if(!(setting) || !(channel)) {
      message.channel.send({ embed: embed, allowedMentions: { repliedUser: false } });
    } else {
      channel.send(embed);
    }

    member.send(`You have been unmuted in **${message.guild.name}**.\nPlease ensure you always follow the rules to prevent being muted again!`);
    //message.channel.send(`\`🔊\` ${member.user.tag} have been unmuted.`);
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "unmute",
  description: "Unmute a member, i feel bad for him.",
  examples: ["unmute @Nekoyasui"],
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
  bot: ["MUTE_MEMBERS"],
  user: ["MUTE_MEMBERS"]
};