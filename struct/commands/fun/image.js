const cheerio = require("cheerio"),
 request = require("request");


exports.run = async (client, message, Discord, [...image]) => {
  try { // Put your Code below.
        var image = image.join(" ");
        if (!image) image = await client.functions.awaitReply(message, `What do you want to search for?`);
        if (!image) return;

        let options = {
          url: "http://results.dogpile.com/serp?qc=images&q=" + image,
          method: "GET",
          headers: {
            Accept: "text/html",
            "User-Agent": "Chrome",
          },
        };
        request(options, function (error, response, responseBody) {
          if (error) return message.inlineReply("No search results found, maybe try searching for something that exists.", { allowedMentions: { repliedUser: false } });

          $ = cheerio.load(responseBody);

          let links = $(".image a.link");
          let urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
          if (!urls.length) return message.inlineReply("No search results found, maybe try searching for something that exists.", { allowedMentions: { repliedUser: false } });
          

          // Send result
          const embed = client.util.BaseEmbed(message).setImage(urls[0]);
          message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } })
        });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "image",
  description: "search images from google",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["img"],
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