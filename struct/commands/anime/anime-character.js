const request = require("node-superfetch"),
{ stripIndents } = require("common-tags"),
searchGraphQL = stripIndents`
	query ($search: String) {
		characters: Page (perPage: 1) {
			results: characters (search: $search) { id }
		}
	}
`, resultGraphQL = stripIndents`
	query ($id: Int!) {
		Character (id: $id) {
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
			media(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
				}
			}
		}
	}
`, types = {
	ANIME: "Anime",
	MANGA: "Manga"
};

exports.run = async (client, message, Discord, [query]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!query) query = await client.functions.awaitReply(message, `What character would you like to search for?`);
    if (!query) return;

			const id = await search(query);
			if (!id) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
			const character = await fetchCharacter(id);

    const embed = client.util.BaseEmbed(message)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setURL(character.siteUrl)
				.setThumbnail(character.image.large || character.image.medium || null)
				.setTitle(`${character.name.first || ''}${character.name.last ? ` ${character.name.last}` : ''}`)
				.setDescription(character.description ? client.util.cleanAnilistHTML(character.description, false) : 'No description.')
				.addField('❯ Appearances', client.util.trimArray(character.media.edges.map(edge => {
					const title = edge.node.title.english || edge.node.title.romaji;
					return client.util.embedURL(`${title} (${types[edge.node.type]})`, edge.node.siteUrl);
				}), 5).join(', '));

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

	async function search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { search: query },
				query: searchGraphQL
			}).catch((e) => { client.functions.sendLogs(message, e, "error")});
		if (!body.data.characters.results.length) return null;
		return body.data.characters.results[0].id;
	}

	async function fetchCharacter(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { id },
				query: resultGraphQL
			}).catch((e) => { client.functions.sendLogs(message, e, "error")});
		return body.data.Character;
	}
  } catch (e) { // End of the Code.
  client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "anime-character",
  description: "Searches AniList for your query, getting character results.",
  examples: ["kirito"],
  usage: ["<character_name>"],
  type: []
};

exports.conf = {
  aliases: ['anilist-character', 'character', 'manga-character', 'manga-char', 'ani-char', 'char', 'anime-char'],
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