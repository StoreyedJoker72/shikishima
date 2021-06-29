const request = require('node-superfetch');

exports.run = async (client, message, Discord, [query]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!query) query = await client.functions.awaitReply(message, `What country would you like to search for?`);
    if (!query) return;

			const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${encodeURIComponent(query)}`);
			const data = body.find(country => {
				const search = query.toLowerCase();
				return country.name.toLowerCase() === search
					|| country.altSpellings.some(alt => alt.toLowerCase() === search)
					|| country.alpha2Code.toLowerCase() === search
					|| country.alpha3Code.toLowerCase() === search
					|| country.nativeName.toLowerCase() === search;
			}) || body[0];

    const embed = client.util.BaseEmbed(message)
				.setTitle(data.name)
				.setThumbnail(`https://www.countryflags.io/${data.alpha2Code.toLowerCase()}/flat/64.png`)
				.addField('❯ Population', client.util.formatNumber(data.population), true)
				.addField('❯ Capital', data.capital || 'None', true)
				.addField('❯ Currency', data.currencies[0].symbol, true)
				.addField('❯ Location', data.subregion || data.region, true)
				.addField('❯ Demonym', data.demonym || 'None', true)
				.addField('❯ Native Name', data.nativeName, true)
				.addField('❯ Area', `${client.util.formatNumber(data.area)}km`, true)
				.addField('❯ Languages', data.languages.map(lang => lang.name).join('/'));

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
  return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    //client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "country",
  description: "Responds with information on a country.",
  examples: ["philippines"],
  usage: ["<country_name>"],
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