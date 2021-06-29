const request = require('node-superfetch'),
 moment = require('moment'),
{ decode: decodeHTML } = require('html-entities'),
 { STACKOVERFLOW_KEY } = process.env;

exports.run = async (client, message, Discord, [...querys]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.
  if(!STACKOVERFLOW_KEY) return message.inlineReply("You must set StackOverFlow Api Key before you can use this command.");
  let query = querys.join(" ");
    if (!query) query = await client.functions.awaitReply(message, `What question would you like to search for?`);
    if (!query) return;

			const { body } = await request
				.get('http://api.stackexchange.com/2.2/search/advanced')
				.query({
					page: 1,
					pagesize: 1,
					order: 'asc',
					sort: 'relevance',
					answers: 1,
					q: query,
					site: 'stackoverflow',
					key: STACKOVERFLOW_KEY
				});
			if (!body.items.length) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
			const data = body.items[0];

    const embed = new Discord.MessageEmbed()
				.setAuthor('Stack Overflow', 'https://i.imgur.com/P2jAgE3.png', 'https://stackoverflow.com/')
				.setURL(data.link)
				.setTitle(decodeHTML(data.title))
        .setColor(client.color.none)
        .addField(`❯ ` + await client.functions.translate(message, "Details"), [
          `• ID: ${data.question_id}`,
          `• Asked: ${client.util.embedURL(data.owner.display_name, data.owner.link)}`,
          `• Created At: ${moment(data.creation_date * 1000).format("L")}, ${moment(data.creation_date * 1000).fromNow()}`,
          `• Last Activity: ${moment(data.last_activity_date * 1000).format("L")}, ${moment(data.last_activity_date * 1000).fromNow()}`,
        ].join("\n"))
        .setFooter(` 👀 ${client.util.formatNumber(data.view_count)} 💯 ${client.util.formatNumber(data.score)}`);

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "stack-overflow",
  description: "Searches Stack Overflow for your query.",
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
  bot: ["EMBED_LINKS"],
  user: []
};