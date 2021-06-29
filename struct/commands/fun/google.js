const request = require("node-superfetch");

exports.run = async (client, message, Discord, [...google]) => {
  try { // Put your Code below.

    let googleKey = "AIzaSyA1cM1C3kFwR8uyTOSSDh7dThNzOIWEINc";
    let csx = "49223130713e974a2";
    let result;
    let query = google.join(" ");
    if (!query) query = await client.functions.awaitReply(message, `What do you want to search for?`);
    if (!query) return;

    href = await search(query);
    if(!href) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
        const embed = client.util.BaseEmbed(message)
        .setTitle(href.title)
        .setDescription(href.snippet)
        .setImage(href.pagemap.cse_thumbnail ? href.pagemap.cse_thumbnail[0].src : null)
        .setURL(href.link);

        message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

    async function search(query){
        const { body } = await request.get("https://www.googleapis.com/customsearch/v1").query({
            key: googleKey, cx: csx, safe:"off", q: query
        });

        if(!body.items) return null;
        return body.items[0];
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "google",
  description: "Googles the internet for you",
  examples: [],
  usage: [],
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