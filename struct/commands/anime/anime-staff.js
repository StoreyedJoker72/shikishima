const request = require("node-superfetch"),
{ stripIndents } = require("common-tags"),
 searchGraphQL = stripIndents`
	query ($search: String) {
		staff: Page (perPage: 1) {
			results: staff (search: $search) { id }
		}
	}
`, resultGraphQL = stripIndents`
	query ($id: Int!) {
		Staff (id: $id) {
			id
			name {
				first
				last
			}
			image {
				large
				medium
			}
			description(asHtml: false)
			siteUrl
			characterMedia(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
					characterRole
					staffRole
				}
			}
			staffMedia(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
					staffRole
				}
			}
		}
	}
`, types = {
	ANIME: 'Anime',
	MANGA: 'Manga'
}, roles = {
	MAIN: 'Main',
	SUPPORTING: 'Supporting',
	BACKGROUND: 'Background'
};

exports.run = async (client, message, Discord, [query]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!query) query = await client.functions.awaitReply(message, `What character would you like to search for?`);
    if (!query) return;

			const id = await search(query);
			if (!id) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
			const staff = await fetchStaff(id);

    const embed = client.util.BaseEmbed(message)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setURL(staff.siteUrl)
				.setThumbnail(staff.image.large || staff.image.medium || null)
				.setTitle(`${staff.name.first || ''}${staff.name.last ? ` ${staff.name.last}` : ''}`)
				.setDescription(staff.description ? client.util.cleanAnilistHTML(staff.description, false) : 'No description.')
				.addField('❯ Voice Roles',
					staff.characterMedia.edges.length ? client.util.trimArray(staff.characterMedia.edges.map(edge => {
						const title = edge.node.title.english || edge.node.title.romaji;
						return client.util.embedURL(`${title} (${roles[edge.characterRole]})`, edge.node.siteUrl);
					}), 5).join(', ') : 'None')
				.addField('❯ Production Roles',
					staff.staffMedia.edges.length ? client.util.trimArray(staff.staffMedia.edges.map(edge => {
						const title = edge.node.title.english || edge.node.title.romaji;
						return client.util.embedURL(`${title} (${types[edge.node.type]})`, edge.node.siteUrl);
					}), 5).join(', ') : 'None');

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
  client.functions.sendLogs(message, e, "error");
  }
};

	async function search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { search: query },
				query: searchGraphQL
			}).catch((e) => { client.functions.sendLogs(message, e, "error")});
		if (!body.data.staff.results.length) return null;
		return body.data.staff.results[0].id;
	}

	async function fetchStaff(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { id },
				query: resultGraphQL
			}).catch((e) => { client.functions.sendLogs(message, e, "error")});
		return body.data.Staff;
	}

exports.help = {
  name: "anime-staff",
  description: "Searches AniList for your query, getting staff results.",
  examples: [],
  usage: ["<staff>"],
  type: []
};

exports.conf = {
  aliases: ['anilist-staff', 'staff', 'manga-staff', 'ani-staff'],
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