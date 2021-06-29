exports.run = async (client, message, Discord, args) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below. 
    let isUrl = require("is-url"), type = "", name = "", link;
    let emote = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
    if(emote) {
      emote = emote[0];
      type = "emoji";
      name = args.join(" ").replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi, "").trim().split(" ")[0];
    } else {
      emote = `${args.find(arg => isUrl(arg))}`
      name = args.find(arg => arg != emote);
      type = "url";
    }
    let emoji = {
      name: ""
    };
    if(type == "emoji") {
      emoji = Discord.Util.parseEmoji(emote);
      link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
    } else {
      if(!name) return message.inlineReply("Please provide a name!", { allowedMentions: { repliedUser: false } });
      link = message.attachments.first() ? message.attachments.first().url : emote;
    }

    const embed = client.util.BaseEmbed(message)
    .setColor(client.color.green)
    .setDescription(`**Emoji Has Been Added!** | **Name:** \`${name || `${emoji.name}`}\` | **Preview:** [Click Me](${link})`);

    return message.guild.emojis.create(`${link}`, `${name || `${emoji.name}`}`)
    .then(() => message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } }))
    .catch((e) => client.functions.sendLogs(message, e, "error"));
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "emoji",
  description: "Add emojis on this server",
  examples: [],
  usage: ["<emoji>", "<name>"],
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
  bot: ["MANAGE_EMOJIS"],
  user: ["MANAGE_EMOJIS"]
};