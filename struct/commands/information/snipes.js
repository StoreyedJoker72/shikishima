exports.run = async (client, message, Discord, args) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.
      const snipes = client.snipes.get(message.channel.id) || [];
      const msg = snipes[args[0] - 1 || 0];
      if (!msg) return message.inlineReply("No one has deleted any message!", { allowedMentions: { repliedUser: false } });
      const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({size: 4096, dynamic: true}))
        .setColor(client.color.purple)
        .setDescription(msg.content)
        .setFooter(`Time : ${msg.date}`);
      if (msg.image) Embed.setImage(msg.image);
      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "snipes",
  description: "Snipes a deleted message in a channel.",
  examples: [],
  usage: ["<value(1 - 10)>"],
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
  client: [],
  user: [],
};
