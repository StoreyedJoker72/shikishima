exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.

let aq = require('animequote');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();

            let search = args.join(" ");

            if (!search) {

                kitsu.searchAnime(aq().quoteanime).then(result => {

                    let anime = result[0];
                    let embed = client.util.BaseEmbed(message)
                        .setColor(colorRan())
                        .setAuthor('Kitsu', 'https://kitsu.io/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png', 'https://kitsu.io/explore/anime')
                        //.setAuthor(`${anime.titles.english} | ${anime.showType}`, anime.posterImage.original)
                        .setTitle(`${anime.titles.english ? anime.titles.english : anime.titles.romaji} | ${anime.showType ? anime.showType : ''}`)
                        .setURL(`https://kitsu.io/anime/${anime.slug}`)
                        .setThumbnail(anime.posterImage.original)
                        .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
                        .addField('❯\u2000\Information', `•\u2000\**Japanese Name:** ${anime.titles.romaji}\n\•\u2000\**Age Rating:** ${anime.ageRating}\n\•\u2000\**NSFW:** ${anime.nsfw ? 'Yes' : 'No'}`)
                        .addField('❯\u2000\Stats', `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`)
                        .addField('❯\u2000\Status', `•\u2000\**Episodes:** ${anime.episodeCount ? anime.episodeCount : 'N/A'}\n\•\u2000\**Start Date:** ${moment(anime.startDate).format('LL')}\n\•\u2000\**End Date:** ${anime.endDate ? moment(anime.endDate).format('LL') : "Still airing"}`);
                    return message.inlineReply(`\`📺\` Try watching **${anime.titles.english}**!\n`, { embed: embed, allowedMentions: { repliedUser: false } });
                }).catch((e) => { client.functions.sendLogs(message, e, "error")});

            } else {
                let search = args.join(" ");

                kitsu.searchAnime(search).then(result => {
                    if (result.length === 0) {
                        return message.inlineReply(`No search results found for **${search}**!`, { allowedMentions: { repliedUser: false } });
                    }

                    let anime = result[0]

                    let embed = client.util.BaseEmbed(message)
                        .setColor(colorRan())
                        .setAuthor('Kitsu', 'https://kitsu.io/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png', 'https://kitsu.io/explore/anime')
                        //.setAuthor(`${anime.titles.english ? anime.titles.english : search} | ${anime.showType}`, anime.posterImage.original)
                        .setTitle(`${anime.titles.english ? anime.titles.english : search} | ${anime.showType ? `${anime.showType}` : ''}`)
                        .setThumbnail(anime.posterImage.original)
                        .setURL(`https://kitsu.io/anime/${anime.slug}`)
                        .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
                        .addField('❯\u2000\Information', `•\u2000\**Japanese Name:** ${anime.titles.romaji}\n\•\u2000\**Age Rating:** ${anime.ageRating}\n\•\u2000\**NSFW:** ${anime.nsfw ? 'Yes' : 'No'}`, true)
                        .addField('❯\u2000\Stats', `•\u2000\**Average Rating:** ${anime.averageRating}\n\•\u2000\**Rating Rank:** ${anime.ratingRank}\n\•\u2000\**Popularity Rank:** ${anime.popularityRank}`)
                        .addField('❯\u2000\Status', `•\u2000\**Episodes:** ${anime.episodeCount ? anime.episodeCount : 'N/A'}\n\•\u2000\**Start Date:** ${moment(anime.startDate).format('LL')}\n\•\u2000\**End Date:** ${anime.endDate ? moment(anime.endDate).format('LL') : "Still airing"}`);
                    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
                }).catch((e) => { client.functions.sendLogs(message, e, "error")});
            }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "anime",
  description: "Searches for an anime on Kitsu.io! If no anime name is given, it gives you a random suggestion!",
  examples: [],
  usage: ["<anime_name>"],
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