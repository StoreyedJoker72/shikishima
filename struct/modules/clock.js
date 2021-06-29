const Discord = require("discord.js-light"),
moment = require("moment"),
fetch = require("node-fetch"),
cheerio = require("cheerio");
require("moment-duration-format");

module.exports = (client) => {
    try {    

      client.on("ready", () => {
          let option = {
            guild: "790477008055435304",
            channel: "803692459300749332",
            location: "philippines",
            interval: 30000
          };

          setInterval(async function () {

          //Get our server
          const guild = client.guilds.cache.get(option.guild);
          if (!guild) return client.util.Log().warning("Clock Module", `Guild cannot be found`);

          //Get our channels
          const channel = guild.channels.cache.find(c => c.id === option.channel && c.type === 'voice');
          if (!channel) return client.util.Log().warning("Clock Module", `Channel cannot be found on ${guild.name}`);

          // Get our time location
          const body = await fetch(`https://time.is/${option.location}`)
          .then((res) => res.text())
          .then((html) => cheerio.load(html));
          const error = body("div.w90 h1.error").text();
          if (error) return client.util.Log().error("Clock Module", `No search results found, maybe try searching for something that exists.`);
          const time = moment(body("time").text(), 'HH:mm:ss').format('h:mm A');
          
          await channel.setName(time, "Updating time.");
          }, option.interval)
      })
    } catch(e){
        client.util.Log().error("Clock Module", "there is a problem occured while running the module.");
    }
}