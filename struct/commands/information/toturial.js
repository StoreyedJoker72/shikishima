const youtube = require("youtube-sr").default;

exports.run = async (client, message, Discord, [...toturial]) => {
  try { // Put your Code below.
    const searchString = toturial.join(" ");
    if (!searchString) searchString = await client.functions.awaitReply(message, `What video toturial am i supposed to show you?`);
    //if (!location) return;
    let found = await youtube.search(`Nekoyasha ${searchString}`, { limit: 1 });
    if(!found) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    console.log(found[0].thumbnail.url)
    
      const embed = client.util.BaseEmbed(message)
			.setAuthor(found[0].title)
      .setImage(found[0].thumbnail.url);

      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "toturial",
  description: "Search video toturials.",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["find"],
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