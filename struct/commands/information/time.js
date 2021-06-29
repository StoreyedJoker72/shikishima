const moment = require("moment"),
fetch = require("node-fetch"),
cheerio = require("cheerio");
require("moment-duration-format");

exports.run = async (client, message, Discord, [location]) => {
  try { // Put your Code below.
    if (!location) location = await client.functions.awaitReply(message, `What time location am i supposed to show you?`);
    //if (!location) return;
    if(location.includesOf(["all", "worldwide", "world wide", "world-wide"])){
  const worldwide = ["Korean", "Japan", "Philippines"];
  let getting = [];
  new Promise(async resolve => {
    resolve(2);
    try{
        for (let i = 0; i < worldwide.length; i++) {
          const body = await fetch(`https://time.is/${worldwide[i]}`)
          .then((res) => res.text())
          .then((html) => cheerio.load(html));
          const error = body("div.w90 h1.error").text();
          const time = moment(body("time").text(), 'HH:mm:ss').format('h:mm A');
          const locale = body("div#msgdiv").text();
          const date = body("div.clockdate").text();
          if (!(error.length > 1 && worldwide[i] === undefined)){
          console.log(worldwide[i], time, locale, date)
            getting.push(`• ${worldwide[i]}: ${time}`);
            continue;
          } else break;
        }
    } catch { }
    const embed = new Discord.MessageEmbed()
    .setTitle("WorldWide")
    .setDescription(getting.join("\n"))
    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
  })
        
    }
    const body = await fetch(`https://time.is/${location}`)
    .then((res) => res.text())
    .then((html) => cheerio.load(html));
    const error = body("div.w90 h1.error").text();
    if (error) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });

    const locale = body("div#msgdiv").text();
    const time = moment(body("time").text(), 'HH:mm:ss').format('h:mm A');
    const date = body("div.clockdate").text();
    const title = body("div#maptext ul li").first().text();
    const latlong = body("div#maptext ul li").next().first().text();
    const population = body("div#maptext ul li").next().next().first().text();
    const map = body("div#maptext a").attr('href');
    const info = body("section#time_zone ul li").next().next().next().next().first().text();
    console.log(`• Error: ${error}\n• Locale: ${locale}\n• Time: ${time}\n• Date: ${date}\n• Title: ${title}\n• Coordination: ${latlong}\n• Population: ${population}\n• Map: ${map}\n• Information: ${info}`)

    const embed = client.util.BaseEmbed(message)
    .setTitle(time)
    .setURL(`https://time.is/${encodeURI(location)}`)
    .setDescription(`**${locale ? locale: "\u200b"}**
     ${date ? date: "\u200b"}`)
    .addFields([
        //{ name: "❯ " + await client.functions.translate(message, "Coordinates"), value: `• ${latlong ? latlong: "Not Specified"}`},
        //{ name: "❯ " + await client.functions.translate(message, "Population"), value: `• ${population ? population: "Not Specified"}`},
        //{ name: '\u200b', value: info ? info: "\u200b" }
    ])

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "time",
  description: "Shows the time for the given location!",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["clock"],
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