exports.run = async (client, message, Discord, [...member]) => {
  try { // Put your Code below.
  member = member.join(" ")
  member = await client.util.searchMember(message, member, { current: true });
    if(!member) {
      return message.inlineReply(`**${message.author.username}**, Please mention the person who you want to hack -.-`, { allowedMentions: { repliedUser: false } })
    }
    
    if(member.id === message.author.id) {
     return message.inlineReply(`**${message.author.username}**, You can not hack yourself >;c`, { allowedMentions: { repliedUser: false } })
    }
      const msg = await message.inlineReply(`Hacking is almost done.`, { allowedMentions: { repliedUser: false } });
      const age = Math.floor(Math.random() * 100) + 1;
      const Embed = client.util.BaseEmbed(message)
        .setTitle("Member Hacked")
        .setDescription(
          `${member} has been hacked by @${message.author.tag}\n **Information**\n Age: ${age} | Bot: **Yes** `
        )
        .setColor('#fb644c');
      msg.edit(Embed);
      msg.edit("\u200b");
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "hack",
  description: "Hack a person",
  examples: [],
  usage: [],
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
  bot: [],
  user: []
};