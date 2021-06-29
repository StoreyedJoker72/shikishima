const request = require('node-superfetch');

exports.run = async (client, message, Discord, [article]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!article) article = await client.functions.awaitReply(message, `What article would you like to search for?`);
    if (!article) return;

		const { body } = await request.get('https://developer.mozilla.org/en-US/search.json').query({ q: article, locale: 'en-US', highlight: false });
    if (!body.documents.length) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
		const data = body.documents[0];

    const embed = client.util.BaseEmbed(message)
				.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
				.setURL(data.url)
				.setTitle(data.title)
				.setDescription(data.excerpt);

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "mdn",
  description: "Searches MDN for your query.",
  examples: ["Array"],
  usage: ["<query>"],
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
  bot: ["EMBED_LINKS"],
  user: []
};