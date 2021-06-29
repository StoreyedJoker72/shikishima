const { stripIndents } = require("common-tags");

exports.run = async (client, message, Discord) => {
  member = await client.util.searchMember(message, message.author.id);
  if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code below.
    let title, desc, ping, role, embed, color;
    if(!title) title = await client.functions.awaitReply(message, `What will be the title of your announcement?`);
    if(!title) {
      return;
    } else {
      if(!desc) desc = await client.functions.awaitReply(message, `What will be the description of your announcement?`);
      await client.util.delay(500);
      if(!ping) ping = await client.functions.awaitReply(message, `Do you want to mention role for your announcement?`);
      await client.util.delay(500);
      if(ping && ping.includesOf(client.yes) && !role) {
        if(!role) role = await client.functions.awaitReply(message, `What will be the role do you want to ping for your announcement?`);
        if(role) role = await client.util.searchRole(message, role);
        if(!role || !role.id) return message.inlineReply("`❌` That role cannot be found on this server.", { allowedMentions: { repliedUser: false } });
        await client.util.delay(500);
      }
      if(!embed) embed = await client.functions.awaitReply(message, `Do you want to make your announcement embedded?`);
      await client.util.delay(500);
      if(embed && embed.includesOf(client.yes) && !color) {
        if(!color) color = await client.functions.awaitReply(message, `What will be the Embed Color of your announcement?`);
        if(color && !(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(color))) {
          await client.util.delay(500);
          message.inlineReply("`❌` Invalid Color, I will gonna be using default color.", { allowedMentions: { repliedUser: false } });
          color = null;
        }
        await client.util.delay(500);
      }
      if(embed && embed.includesOf(client.yes)) {
        const content = new Discord.MessageEmbed()
          //.setTitle(title? title : "N/A")
          .setColor(color ? color : client.color.none).setDescription(stripIndents(`
          **${title? title : "N/A"}** ${client.config.emojis.ping}
          ${desc? desc : "No description."}
          ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ${role? `<@&${role.id}>`: ""}
          `));
        client.util.sendWebhook(message, content, {
          username: member.user.username,
          avatar: member.user.displayAvatarURL({
            size: 4096,
            dynamic: true
          })
        });
      } else {
        const content = stripIndents(`
          **${title? title : "N/A"}** ${client.config.emojis.ping}
          ${desc? desc : "No description."}
          ||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ${role? `<@&${role.id}>`: ""}
          `);
        client.util.sendWebhook(message, content, {
          username: member.user.username,
          avatar: member.user.displayAvatarURL({
            size: 4096,
            dynamic: true
          })
        });
      }
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "announcement",
  description: "Create an Announcement.",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["announce"],
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
  user: ["MANAGE_MESSAGES"]
};