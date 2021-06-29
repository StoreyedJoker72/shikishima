const request = require('node-superfetch');

exports.run = async (client, message, Discord, [...article]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    let searchstring = article.join(" ");
    if (!searchstring) searchstring = await client.functions.awaitReply(message, `What article would you like to search for?`);
    if (!searchstring) return;

			const { body } = await request
				.get('https://en.wikipedia.org/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts|pageimages',
					format: 'json',
					titles: searchstring,
					exintro: '',
					explaintext: '',
					pithumbsize: 150,
					redirects: '',
					formatversion: 2
				}).catch((e) => { client.functions.sendLogs(message, e, "error")});
			const data = body.query.pages[0];
			if (data.missing) { return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
      } else {
    const embed = client.util.BaseEmbed(message)
				.setTitle(data.title)
				.setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
				.setThumbnail(data.thumbnail ? data.thumbnail.source : null)
				.setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(searchstring).replace(')', '%29')}`)
				.setDescription(client.util.shorten(data.extract.replace('\n', '\n\n')));

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
      }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "wikipedia",
  description: "Searches Wikipedia for your query.",
  examples: ["earth"],
  usage: ["<query>"],
  type: []
};

exports.conf = {
  aliases: ["wiki"],
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