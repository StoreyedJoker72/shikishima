const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, Discord, [channel]) => {
  try { // Put your Code below.

    channel = await client.util.searchChannel(message, channel, { current: true });
    const lastmessages = await channel.messages.fetch({
        after: 1,
        limit: 1
    });
    const lastmessage = lastmessages.first();
    const avatar = lastmessage.author.displayAvatarURL({size: 4096, dynamic: true})
    const embed = client.util.BaseEmbed(message)
    .setColor(lastmessage.member ? lastmessage.member.displayHexColor : 0x00ae86)
    .setTitle(await client.functions.translate(message, "First Message"))
    .setDescription(lastmessage.content)
    .setURL(lastmessage.url)
    .setThumbnail(avatar)
    .addField("\n❯ " + await client.functions.translate(message, "Message Details"), [
        `• ID: ${lastmessage.id}`, `• Author: ${lastmessage.author}`, `• Created At: ${moment(lastmessage.createdAt).format("L")}, ${moment(lastmessage.createdAt).fromNow()}`
    ])
    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } })

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "firsmessage",
  description: "Get the first message of a certain channel",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["fmsg", "firstmsg"],
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