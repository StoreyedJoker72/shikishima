const Discord = require("discord.js-light")
 moment = require("moment");

const PrettyError = require("pretty-error"),
pe = new PrettyError();
/*pe.withoutColors();
pe.filter(function(traceLine, lineNumber){
  // the 'what' clause is something like:
  // 'DynamicTimeline.module.exports.DynamicTimeline._verifyProp'
  if (typeof traceLine.what !== 'undefined'){

      // we can shorten it with a regex:
      traceLine.what = traceLine.what.replace(
        /(.*\.module\.exports\.)(.*)/, '$2'
      );
  }
});*/

module.exports = (client) => {

    //Snipes
    client.on('messageDelete', function(message) {
      if(!message || !(message.guild) || !(message.content) || message.content.match(/^([`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\w]+:?[a-zA-Z0-9]{1,6})$/gi) || message.author.bot || message.author.id === message.client.user.id) return;
      if(!(message.channel.permissionsFor(message.client.user).has(['SEND_MESSAGES']))) return;
      let PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.user.username.toLowerCase().fixedUsername()}|<@!?${message.author.id}> cmd|${message.author.username.fixedUsername()} cmd)`, "i", "(\s+)?");
      let usedPrefix = message.content.toLowerCase().match(PrefixRegex);
      usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
      if(usedPrefix) return;
      const snipes = message.client.snipes.get(message.channel.id) || [];
      snipes.unshift({
        content: message.content,
        author: message.author,
        image: message.attachments.first() ?
          message.attachments.first().proxyURL : null,
        date: fullDate(), 
      });
      snipes.splice(10);
      message.client.snipes.set(message.channel.id, snipes);
    });

    client.on('messageUpdate', function(message) {
      if(!message || !(message.guild) || !(message.content) || message.content.match(/^([`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\w]+:?[a-zA-Z0-9]{1,6})$/gi) || message.author.bot || message.author.id === client.user.id) return;
      if(!(message.channel.permissionsFor(message.client.user).has(['SEND_MESSAGES']))) return;
      let PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.user.username.toLowerCase().fixedUsername()}|<@!?${message.author.id}> cmd|${message.author.username.fixedUsername()} cmd)`, "i", "(\s+)?");
      let usedPrefix = message.content.toLowerCase().match(PrefixRegex);
      usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
      if(usedPrefix) return;
      let esnipes = message.client.esnipes.get(message.channel.id) || [];
      esnipes.unshift({
        content: message.content,
        author: message.author,
        url: message.url,
        image: message.attachments.first() ?
          message.attachments.first().proxyURL : null,
        date: fullDate(),
      });
      esnipes.splice(10);
      message.client.esnipes.set(message.channel.id, esnipes);
    });


    client.on('error', (error) => {
        client.util.Log().error("Discord Error", error)
    });

    client.on('guildUnavailable', (guild) => {
        client.util.Log().error("Discord Error", `${guild.name} is unreachable, likely due to outage`)
    });

    client.on('invalidated', () => {
        client.util.Log().error("Discord Error", `Client session has become invalidated.`)
        client.destroy()
    });
    
    client.on("rateLimit", (ratelimit) => {
        client.util.Log().error("Discord Error", `Client is being rate limited.
        Timeout: ${ratelimit.timeout} ms
        Limit: ${ratelimit.limit}
        Method: ${ratelimit.method}
        Path: ${ratelimit.path}
        Route: ${ratelimit.route}`)
    })

    client.on('warn', (info) => {
        client.util.Log().warn("Discord Warning", info)
    });

    client.on('debug', (bug) => {
        //client.util.Log().debug("Discord Debug", bug)
    });

    client.on("ready", async () => {
        if(!client.config.bot.id.includes(client.user.id)){
            client.util.Log().warn("Invalid Client ID", "please update your config.js")
        }
    });

    /**client.on("guildMemberAdd", async (member) => {
        const config = {
            "hoursJoined": 1,
           "daysJoined": 0
        }
        let currentTime = Date.now()
        let dt = new Date();
        dt.setHours(dt.getHours() - config.hoursJoined)
        dt.setDate( dt.getDate() - config.daysJoined);
        if (currentTime - member.user.createdAt <= currentTime- dt) {

            const options = { days: 7 };
            const reason = "Suspicious Account (Dummy Account)";
            if(reason) options.reason = reason;

            await member.ban(options);
            let setting = await message.client.quickdb.get(`channels.${message.guild.id}.moderation`);
            if(!(setting)) return;
            const channel = member.guild.channels.cache.find(c => c.id === setting);
            if(channel) {
              const avatar = client.user.displayAvatarURL({
                dynamic: true
              });
              const embed = new Discord.MessageEmbed()
              .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
              .setAuthor(client.user.tag, avatar)
              .setDescription([
                `**❯ Member** • ${member.user.tag}`,
                `**❯ Action** • Ban`,
                `**❯ Reason** • ${reason ? reason : "Not Specified"}`
              ].join("\n"))
              .setColor(client.color.orange)
              .setTimestamp();

              return client.util.sendWebhook(member.guild, channel, embed);
            } else {

                member.ban({ days: 7, reason: 'Suspicious Account (Dummy Account)' })
                .then(() => {console.log("Banned user:", member.user.username, "(id:", member.user.id,") since his account is less than", config.hoursJoined, "hour(s) and", config.daysJoined, "day(s) old")})
                .catch(console.error);

            }
        }
    });**/
    process.on("uncaughtException", (error) => {
        //const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        client.util.Log().error("Uncaught Exception", pe.render(error))
        process.exit(1);
    });

    process.on("unhandledRejection", async (err) => {
        if(!err.code === 10013) client.util.Log().error("Unhandled rejection", pe.render(err));

        if(err.code === 10008 || err.code === "INVALID_TYPE" || err.code === 10013 || err.code === 0 || err.code === undefined || err.code === "ERR_UNESCAPED_CHARACTERS") return;

        let title = `Missing Error Code: ${err.code}`;
        let description = "This **error** can be caused by one of the following\n**Error Code** most be defined or it can't be found.";

        if(err.code === 50013) {
            title = "Missing Permissions";
            description = "This **error** can be caused by one of the following: \n**Creating invite link** require `CREATE_INSTANT_INVITE` to be in a channel where you are.\n**Reacting on a message** require `ADD_REACTIONS | READ_MESSAGE_HISTORY` to be in the same channel as the post.";
        }
        else if(err.code === 50035) {
            title = "Invalid Form Body";
            description = "This **error** can be caused by one of the following: \n**Bot** cannot send an empty embedded message this action is occured \nwhen \`\`new Discord.MessageEmbed\`\` are empty.\n(requirement changes based on the type of action you are trying to execute).";

        }
        else if(err.code === 50001) {
            title = "Missing Access";
            description = "This **error** can be caused by one of the following: \n**Text Channels** require `VIEW_CHANNEL` as detailed above.\n**Voice Channels** require `CONNECT` in the same way.\n**Bot** is missing the needed permission to execute \nthis action in it's calculated base or final permissions \n(requirement changes based on the type of action you are trying to execute).";
        }
        else if(err.code === 50006) {
            title = "Empty Message";
            description = "This **error** can be caused by one of the following: \n**Bot** cannot send an empty message this action is occured \nwhen \`\`.send(), console.log(), etc...\`\` are empty.\n(requirement changes based on the type of action you are trying to execute).";
        }
        else if(err.code === "ECONNRESET") {
            title = "Empty Message";
            description = "This **error** can be caused by one of the following: \n**Bot** cannot send an empty message this action is occured \nwhen \`\`.send(), console.log(), etc...\`\` are empty.\n(requirement changes based on the type of action you are trying to execute).";
        }

      const embed = new Discord.MessageEmbed()
      .setDescription(description)
      .setAuthor(`Monitor | ${title}`, "https://cdn.discordapp.com/attachments/797438840151212052/814723975878934538/monitor.png?size=4096", "https://bot.shikishima.ga/")
      .setColor(client.color.orange);

      let option = {
        guild: client.guildID,
        channel: client.channelID
      }

      const guild = client.guilds.cache.get(option.guild);
      if(!guild) return;
      const channel = guild.channels.cache.find(c => c.id === option.channel && c.type === 'text');

      if (channel) { return //channel.send(embed); 
      } else {
        let channels = guild.channels.cache.filter((ch) => ch.type === "text");
        var iterations = 0;

        for (let found of channels) {
            iterations++;
            if(guild.me.permissionsIn(found).has(["SEND_MESSAGES","VIEW_CHANNEL"])) {
              console.log("I don't have permission to send messages.");
              //return found.send(embed);
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });
}