exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.

    const Method = args[0] ? args[0].toLowerCase() : "";
    switch (Method) {
    case "set":
    case "edit":
    case "change":
        return settings(message, args.slice(1));
    case "reset":
    case "delete":
    case "del":
        return reset(message, args.slice(1));
    case "maintenance":
        return maintain(message, args.slice(1));
    default :
        return;
    }

    async function maintain(message, args) {
      if(args[0] === "-s") {
        let maintenance = await message.client.quickdb.get(`bot.settings.maintenance`);
          if(!(maintenance === "enable")) return message.inlineReply(`Bot is not in maintenance mode.`, { allowedMentions: { repliedUser: false } });
          console.log('Bot exiting maintenance mode... Executed by: ' + message.author.tag + ` ID: ${message.author.id}${args.slice(1, args.length).length ? ` Reason: ${args.slice(1, args.length).join(' ')}` : ''}`);
          await message.client.quickdb.set(`bot.settings.maintenance`, "disable");
          message.client.user.setPresence({
              afk: false,
              status: "online",
              activity: {
                  name: "🛠️ Myself Leave maintenance Mode.",
                  type: 'WATCHING'
              }
          });
          new Promise(resolve => setTimeout(resolve, 2000));
          client.emit("ready");
        return message.inlineReply(`**Exited maintenance mode.**`, { allowedMentions: { repliedUser: false } });
      }
      let maintenance = await message.client.quickdb.get(`bot.settings.maintenance`);
        message.channel.send('`🛠️` **Entering maintenance mode. Do \`maintenance -s <reason>\` to exit.**');
        if(maintenance === "enable") return message.inlineReply(`Bot is already in maintenance mode.`, { allowedMentions: { repliedUser: false } })
        console.log('Bot entering maintenance mode... Executed by: ' + message.author.tag + ` ID: ${message.author.id}${args.length ? ` Reason: ${args.join(' ')}` : ''}`);
        await message.client.quickdb.set(`bot.settings.maintenance`, "enable");
        message.client.user.setPresence({
            activity: {
                name: "🛠️ Myself being worked on. Not available currently, in maintenance mode.",
                type: "WATCHING",
            },
            afk: true,
            status: "dnd",
        });
        message.channel.send(`**Entered maintenance mode.**`);
    }

    async function settings(message, [key, ...setting]) {
      if(key === "avatar" || key === "pfp" || key === "profile"){
        let avatar = setting.join(" ");
          client.user.setAvatar(avatar.toString()).then(updated => {
                  console.log(updated)
                  const embed = client.util.BaseEmbed(message)
                      .setColor(client.color.green)
                      .setDescription('Avatar changed successfully to:')
                      .setImage(updated.avatarURL({dynamic: true, size: 4096}));

                  message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
              }
          ).catch(err => {
              client.functions.sendLogs(message, err, "error");
          })
      } else

      if(key === "username" || key === "name"){


        const newName = setting.join(' ');

        let oldName = client.user.tag;

        client.user.setUsername(newName)
            .then(updated => {
                  const embed = client.util.BaseEmbed(message)
                    .setColor(client.color.green)
                    .setDescription('Username changed successfully!')
                    .addField('Old name', oldName)
                    .addField('New name', updated.tag);

                message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
            })
            .catch(err => {
              client.functions.sendLogs(message, err, "error");
            });
      }
    }

    async function reset(message) {
    let avatar = "https://i.imgur.com/VEdHnUt.jpg", username = "Shikishima";
    client.user.setAvatar(avatar).catch((e) => client.functions.sendLogs(message, e, "error"));
    client.user.setUsername(username).catch((e) => client.functions.sendLogs(message, e, "error"));
    const embed = client.util.BaseEmbed(message)
      .setColor(client.color.green)
      .setDescription("Bot Avatar/Username has been successfully reset.");
      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    }

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "bot",
  description: "Change bot settings",
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
  owner: true,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: [],
  user: []
};