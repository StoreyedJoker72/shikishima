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
            channel: "802039287376773136",
            message: {
              role: "812678313675849790",
              clock: "812678314568581140"
            },
            location: "Dadiangas, Philippines"
          };

          setInterval(async function () {

          //Get our server
          const guild = client.guilds.cache.get(option.guild);
          if (!guild) return client.util.Log().warning("Status Module", `Guild cannot be found.`);

          //Get our channels
          const channel = guild.channels.cache.find(c => c.id === option.channel && c.type === 'text');
          if (!channel) return client.util.Log().warning("Status Module", `Channel cannot be found on ${guild.name}.`);

          //Get out message that we want to edit
          const notify_role = await channel.messages.fetch(option.message.role);
          const notify_clock = await channel.messages.fetch(option.message.clock);
          if (!notify_role || !notify_clock) return client.util.Log().warning("Status Module", `Message cannot be found on ${channel.name}.`);
          if (!notify_role.author.bot || !notify_clock.author.bot) return client.util.Log().warning("Status Module", `This message are not created by bot.`);

          // Get our time location
          const body = await fetch(`https://time.is/${option.location}`)
          .then((res) => res.text())
          .then((html) => cheerio.load(html));
          const error = body("div.w90 h1.error").text();
          if (error) return client.util.Log().error("No search results found, maybe try searching for something that exists.");
          const time = moment(body("time").text(), 'HH:mm:ss').format('h:mm A');
          const locale = body("div#msgdiv").text();
          const date = body("div.clockdate").text();

          let list = new Discord.MessageEmbed()
          .setColor(client.color.pink) 
          .setTitle("Automatic Role List")   
          .setDescription([      //replace all the ids below with your staff list server id and replace all role ids with your roles
            `Owners: ${guild.roles.cache.find(r=>r.id == "799904640253952000").members.map(m=>`\`${m.user.tag}\``).join(", ")}`,
            `Artificial intelligence: ${guild.roles.cache.find(r=>r.id == "799903977969942538").members.map(m=>`\`${m.user.tag}\``).join(", ")}`,
            `Bot: ${guild.roles.cache.find(r=>r.id == "790950014129537044").members.map(m=>`\`${m.user.tag}\``).join(", ")}`,
            `Adventurer: ${guild.roles.cache.find(r=>r.id == "790950016092078140").members.map(m=>`\`${m.user.tag}\``).join(", ")}`,
          ]); //replace the names with your role names

          let clock = new Discord.MessageEmbed()
          .setColor(client.color.pink) 
          .setAuthor(`Server Time: ${time}`, 'https://static.time.is/favicon.ico', `https://time.is/${encodeURI(option.location)}`)
          .setDescription(`**${locale ? locale: "\u200b"}** \n${date ? date: "\u200b"}`);

          await notify_role.edit(list);
          await notify_clock.edit(clock);
          }, 1000 * 60 * 5);
      })
    } catch(e){
        client.util.Log().error("Status Module", "there is a problem occured while running the module.");
    }
}