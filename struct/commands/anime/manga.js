const Kitsu = require("kitsu.js"),
 kitsu = new Kitsu();

exports.run = async (client, message, Discord, [...search]) => {
  try { // Put your Code below.

      search = search.join(" ");

      kitsu.searchManga(search).then(result => {
        if (result.length === 0) {
          return message.inlineReply(`No search results found for **${search}**!`, { allowedMentions: { repliedUser: false } });
        }

        let manga = result[0];

        let embed = client.util.BaseEmbed(message)
          .setColor(colorRan())
          .setAuthor('Kitsu', 'https://kitsu.io/favicon-194x194-2f4dbec5ffe82b8f61a3c6d28a77bc6e.png', 'https://kitsu.io/explore/manga')
          //.setAuthor(`${manga.titles.english}`, manga.posterImage.original)
          .setTitle(`${manga.titles.english ? manga.titles.english : manga.titles.romaji}`)
          .setURL(`https://kitsu.io/manga/${manga.slug}`)
          .setDescription(manga.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
          .addField('❯\u2000\Information', `•\u2000\**Japanese Name:** ${manga.titles.romaji}\n\•\u2000\**Age Rating:** ${manga.ageRating ? manga.ageRating : '`N/A`'}\n\•\u2000\**Chapters:** ${manga.chapterCount ? manga.chapterCount : '`N/A`'}`)
          .addField('❯\u2000\Stats', `•\u2000\**Average Rating:** ${manga.averageRating ? manga.averageRating : '`N/A`'}\n\•\u2000\**Rating Rank:** ${manga.ratingRank ? manga.ratingRank : '`N/A`'}\n\•\u2000\**Popularity Rank:** ${manga.popularityRank ? manga.popularityRank : '`N/A`'}`)
          .addField('❯\u2000\Status', `•\u2000\**Volumes:** ${manga.volumeCount ? manga.volumeCount : '`N/A`'}\n\•\u2000\**Start Date:** ${moment(manga.startDate).format('LL')}\n\•\u2000\**End Date:** ${manga.endDate ? moment(manga.endDate).format('LL') : "Ongoing"}`)
          .setThumbnail(manga.posterImage.original);
        return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
      }).catch((e) => { client.functions.sendLogs(message, e, "error")});
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "manga",
  description: "Searches for a manga with Kitsu.io!",
  examples: [],
  usage: ["<manga_name>"],
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
  usage: true,
  type: false,
  bot: [],
  user: []
};