exports.run = async (client, message, Discord, [member] ) => {
  try { // Put your Code below.

    if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to check permissions?`);
    if (!member) return;

    member = await client.util.searchMember(message, member, { current: true });
    if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    
    const sp = member.permissions.serialize();
    const cp = message.channel.permissionsFor(member).serialize();

      const embed = new Discord.MessageEmbed()
      .setColor(member.displayColor || client.color.none)
      .setTitle(`${member.displayName}'s Permissions`)
      .setDescription([
        '\\♨️ - This Server',
        '\\#️⃣ - The Current Channel',
        '```properties',
        '♨️ | #️⃣ | Permission',
        '========================================',
        `${Object.keys(sp).map(perm => [
          sp[perm] ? `✔️ |` : '❌ |',
          cp[perm] ? '✔️ |' : '❌ |',
          perm.split('_').map(x => x[0] + x.slice(1).toLowerCase()).join(' ')
        ].join(' ')).join('\n')}`,
        '```'
      ].join('\n'));

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "permissions",
  description: "List the server permissions of mentioned user or provided ID",
  examples: ["permission @nekoyasui"],
  usage: ["<@member>"],
  type: []
};

exports.conf = {
  aliases: ["permsfor"],
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