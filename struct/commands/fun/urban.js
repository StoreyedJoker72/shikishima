const request = require('node-superfetch');

exports.run = async (client, message, Discord, [...words]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    let word = words.join(" ");
    if (!word) word = await client.functions.awaitReply(message, `What word would you like to look up?`);
    if (!word) return;

			const { body } = await request
				.get('http://api.urbandictionary.com/v0/define')
				.query({ term: word });
			if (!body.list.length) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
			const data = body.list[0];

    const embed = client.util.BaseEmbed(message)
				.setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
				.setURL(data.permalink)
				.setTitle(data.word)
				.setDescription(client.util.shorten(data.definition.replace(/\[|\]/g, '')))
				.setFooter(`👍 ${client.util.formatNumber(data.thumbs_up)} 👎 ${client.util.formatNumber(data.thumbs_down)}`)
				.setTimestamp(new Date(data.written_on))
				.addField('❯ Example', data.example ? client.util.shorten(data.example.replace(/\[|\]/g, ''), 1000) : 'None');

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "urban",
  description: "Defines a word, but with Urban Dictionary.",
  examples: [],
  usage: ["<word>"],
  type: []
};

exports.conf = {
  aliases: ['urban-dictionary', 'ud'],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: ["EMBED_LINKS"],
  user: []
};