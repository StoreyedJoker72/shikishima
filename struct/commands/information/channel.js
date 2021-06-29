const moment = require("moment"),
 types = {
	dm: "DM",
	group: "Group DM",
	text: "Text Channel",
	voice: "Voice Channel",
	category: "Category",
	unknown: "Unknown"
};

exports.run = async (client, message, Discord, [...value]) => {
  try { // Put your Code below.

    let channel = await client.util.searchChannel(message, value.join(" "), { current: true });
    if (!channel || !channel.id) return message.inlineReply("`❌` That channel cannot be found on this server.", { allowedMentions: { repliedUser: false } });
    const embed = client.util.BaseEmbed(message)
    .setThumbnail(message.guild.iconURL({size: 4096, dynamic: true}))
    .setDescription(await client.functions.translate(message, "Channel Information for") + ` **${channel.type === "dm" ? `@${channel.recipient.username}` : channel.name}** (ID: ${channel.id})`)
    .addField("\n❯ " + await client.functions.translate(message, "Channel Details"), [
        `• NSFW: ${channel.nsfw ? "Yes" : "No"}`,
        `• Category: ${channel.parent ? channel.parent.name : "None"}`,
        `• Type: ${types[channel.type]}`,
        `• Creation Date: ${moment.utc(channel.createdAt).format("MM/DD/YYYY h:mm A")}`,
        `• Topic: ${channel.topic ? channel.topic : "Not Specified"}`,
    ])
    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } })
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "channel",
  description: "Responds with detailed information on a channel.",
  examples: [],
  usage: ["<#channel>"],
  type: []
};

exports.conf = {
  aliases: ["channel-info", "chn"],
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