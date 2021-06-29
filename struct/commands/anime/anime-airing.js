
const request = require("node-superfetch");
const { stripIndents } = require('common-tags');
const moment = require("moment-timezone");
const airingGraphQL = stripIndents`
	query AiringSchedule($greater: Int, $lower: Int) {
		anime: Page {
			results: airingSchedules(airingAt_greater: $greater, airingAt_lesser: $lower) {
				airingAt
				media {
					id
					title {
						english
						romaji
					}
				}
			}
		}
	}
`;
exports.run = async (client, message, Discord, [...value]) => { // eslint-disable-line no-unused-vars
  
  try { // Put your Code below. 
			const anime = await getList();
			if (!anime) 
			if (!id) return message.inlineReply(await client.functions.translate(message, "No anime air today, maybe try next week."), { allowedMentions: { repliedUser: false } });
			const mapped = anime.sort((a, b) => a.airingAt - b.airingAt).map(ani => {
				const title = ani.media.title.english || ani.media.title.romaji;
				const airingAt = moment(ani.airingAt * 1000).tz('Asia/Tokyo').format('h:mm A');
				return `• ${title} (@${airingAt} JST)`;
			});
			return message.inlineReply(stripIndents`
				**Anime Airing on ${moment().tz('Asia/Tokyo').format('dddd, MMMM Do, YYYY')}**
				${mapped.join('\n')}
			`, { allowedMentions: { repliedUser: true } });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

function today(timeZone) {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
  return now;
}

function tomorrow(timeZone) {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
  const today = now;
  today.setDate(today.getDate() + 1);
  return today;
}

async function getList() {
  const { body } = await request
    .post('https://graphql.anilist.co/')
    .send({
      variables: {
        greater: Number.parseInt(today(9).getTime() / 1000, 10),
        lower: Number.parseInt(tomorrow(9).getTime() / 1000, 10)
      },
      query: airingGraphQL
    });
  if (!body.data.anime.results.length) return null;
  return body.data.anime.results;
}
exports.help = {
  name: "anime-airing",
  description: "Responds with a list of the anime that air today.",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["anichart", "airing-anime", "seasonal-anime", "anime-seasonal"],
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