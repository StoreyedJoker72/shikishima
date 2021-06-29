const ms = require("ms");

exports.run = async (client, message, Discord, [member, time, ...reason]) => {
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to mute?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    if(member.id === message.author.id) return message.inlineReply("`❌` Why would you mute yourself?", { allowedMentions: { repliedUser: false } });
    if(member.id === client.user.id) return message.inlineReply("`❌` Why would you mute me?", { allowedMentions: { repliedUser: false } });
    if(member.id === message.guild.ownerID) return message.inlineReply("`❌` You can't mute the owner.", { allowedMentions: { repliedUser: false } });

    if(member.roles.cache.find((r) => r.name === "muted")) return message.inlineReply("`❌` This user is already muted.", { allowedMentions: { repliedUser: false } });
    if(member.roles.highest.position >= message.member.roles.highest.position) return message.inlineReply("`❌` You cannot mute this user.", { allowedMentions: { repliedUser: false } });
    if(member.hasPermission("MANAGE_ROLES")) return message.inlineReply("`❌` I cannot mute this user.", { allowedMentions: { repliedUser: false } });

    if (!time) time = await client.functions.awaitReply(message, `Provide some Time for that member that you want to temporarily mute?`);

    //if (!reason) reason = await client.functions.awaitReply(message, `Tell me your reason, why you want to mute him?`);

    const options = {};
    time = time ? time : "10m";
    reason = reason.length ? reason.join(" ") : null;
    if(time) options.reason = time;
    if(reason) options.reason = reason;

    console.log(`User: ${member.user.username}\nTime: ${time}\nReason: ${reason}`)
    const mutedRole = await client.findOrCreateMutedRole(message.guild);
    client.updateMuteChannelPerms(message.guild, member.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false,
      CONNECT: false,
    });
    member.roles.add(mutedRole);
    console.log(Date.now()+ ms(time));
    setTimeout(function() {
        message.guild.channels.cache.forEach((channel) => {
            channel.permissionOverwrites.get(member.id).delete();
        });
        member.roles.remove(mutedRole)
        message.reply(`<@${member.id}> has been unmuted.`);
    }, ms(time))
    try {
        member.send(`**Notification** \nThis is a notification to say that you have been muted in '${message.guild.name}' \nTime: ${time}`);
    } catch(e) {
        message.inlineReply("`❌` I tried to DM a new user, but their DM's are locked.", { allowedMentions: { repliedUser: false } })
    }

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
      `**❯ Reason** • ${reason ? reason : "Not Specified"}`,
      `**❯ Time** • ${time ? time : "Not Specified"}`
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
  name: "tempmute",
  description: "Mute a Member temporarily, cuz they are little shit",
  examples: ["tempmute @Nekoyasui 10s he is so dumbass"],
  usage: ["<@member>", "<time(s,m,h,d)>", "[reason]"],
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