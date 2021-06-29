const fetch = require("node-fetch");

exports.run = async (client, message, Discord, [...how]) => {
  try { // Put your Code below.

    let searchstring = how.join(" ");
    if (!searchstring) searchstring = await client.functions.awaitReply(message, `What article would you like to search for?`);
    if (!searchstring) return;
    let res = await fetch(`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${searchstring}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "9a14db3995mshcc45d5444dc6e38p14ce98jsn744a850985b7",
		"x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com"
	}
}).catch(() => null);
    if (res.status === 404) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    const body = await res.json();
console.log(body.titles[0])
    const embed = client.util.BaseEmbed(message)
    .setTitle(body.titles[0].title)
    .setImage(body.titles[0].image)
    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "imdb",
  description: "Search for Movies",
  examples: [],
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
  bot: [],
  user: []
};