exports.run = async (client, message, Discord, [key, ...value]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if(!value || value.length === 0) { value = undefined; }
    const Method = key ? key.toLowerCase() : "";
    switch (Method) {
      case "channel":
      return await channel(message, value)
      case "setting":
      return await setting(message, value)
      default:
      //if(!(value.length === 0)) return;
      return await list(message);
    }

    async function list(message){
      console.log("passed")
      let list = {
        channels: ["moderation", "log", "welcome", "goodbye", "cleverbot", "code-snippet", "counting"],
        settings: ["prefix", "verify", "swear", "anti-invite", "anti-spam","sourcebin"]
      }, channels = [], settings = [];

      for (let i = 0; i < list.settings.length; i++) {
        let db = await message.client.quickdb.get(`settings.${message.guild.id}.${list.settings[i]}`);
        console.log(`db: ${db} channel: ${list.settings[i]}`)
        if(list.settings[i] === "verify") {
          settings.push(`• ${list.settings[i]}: ${db ? `<@&${db}>` : "disabled"}`);
        } else {
          settings.push(`• ${list.settings[i]}: ${db ? db : "disabled"}`);
        }
      }
      for (let i = 0; i < list.channels.length; i++) {
        let db = await message.client.quickdb.get(`channels.${message.guild.id}.${list.channels[i]}`);
        //console.log(`db: ${db} channel: ${list.channels[i]}`)
        channels.push(`• ${list.channels[i]}: ${db ? `<#${db}>` : "disabled"}`);
      }
      const embed = message.client.util.BaseEmbed(message)
      .setDescription(await message.client.functions.translate(message, "Configuration for") + ` **${message.guild.name}**`)
      .setThumbnail(message.guild.iconURL({size: 4096, dynamic: true}))
      .addField("❯ " + await message.client.functions.translate(message, "Settings"), settings)
      .addField("❯ " + await message.client.functions.translate(message, "Channels"), channels);
        message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    }

    async function channel(message, [key, ...value]){
      console.log("passed")
    if(!value || value.length === 0) { value = undefined; }
      const Method = key ? key.toLowerCase() : "";
      if(!Method || Method.length === 0) return;
      switch (Method) {
        case "set":
        case "edit":
        case "change":
        return await channel_edit(message, value);
        case "unset":
        case "delete":
        case "remove":
        case "disable":
        return await channel_delete(message, value);
        default:
        return;
      }

      async function channel_delete(message, [key]){
        console.log("passed")
        if(!(key.includesOf(["moderation", "log", "welcome", "goodbye", "cleverbot", "code-snippet", "counting"]))) return;
        let check = await client.functions.awaitReply(message, `Would you like to disable the ${key} feature?`);
        if(!check) return;
        if(!(check.includesOf(client.yes))) return message.inlineReply("`❌` It appears that you did not say **yes**, thus cancelling the command.", { allowedMentions: { repliedUser: false } });
        let db = await message.client.quickdb.get(`channels.${message.guild.id}.${key}`);
        if(!(db)) return message.inlineReply(`\`❌\` It appears that **${key} feature** is already disabled, thus cancelling the command.`, { allowedMentions: { repliedUser: false } });
        return message.inlineReply(`\`${key} setting\` successfully \`disabled\``, { allowedMentions: { repliedUser: true } })
        .then(async() => {
          await message.client.quickdb.delete(`channels.${message.guild.id}.${key}`);
        })
      }

      async function channel_edit(message, [key]){
        console.log("passed")
        if(!(key.includesOf(["moderation", "log", "welcome", "goodbye", "cleverbot", "code-snippet", "counting"]))) return;
        let Channel = await client.functions.awaitReply(message, `What channel would you like to set up for \`${key} channel\`?`);
        if(!Channel) return;
        let channel = await client.util.searchChannel(message, Channel);

        // Discord Mention
        if(!(channel) && Channel === "auto-vc" && Channel.match(/^(?:<#?)?(\d{16,22})>$/gi)) {
          let regex = new RegExp(/^(?:<#?)?(\d{17,19})>$/gi);
          channel = {
            id : regex.exec(query)[1],
            type: "voice"
          };
        }
        if(!channel || !(channel.type.includesOf(["text", "voice"])) || channel.length === 0) return message.inlineReply("`❌` That channel was nowhere to be found.", { allowedMentions: { repliedUser: false } });
        return message.inlineReply(`\`${key} channel\` successfully settled to <#${channel.id}>`, { allowedMentions: { repliedUser: true } })
        .then(async() => {
          await message.client.quickdb.set(`channels.${message.guild.id}.${key}`, channel.id);
        })
      }
    }

    async function setting(message, [key, ...value]){
      console.log("passed")
    if(!value || value.length === 0) { value = undefined; }
      const Method = key ? key.toLowerCase() : "";
      if(!Method || Method.length === 0) return;
      switch (Method) {
        case "set":
        case "edit":
        case "change":
        case "enable":
        return await setting_edit(message, value);
        case "unset":
        case "delete":
        case "remove":
        case "disable":
        return await setting_delete(message, value);
        default:
        return;
      }

      async function setting_delete(message, [key]){
        console.log("passed")
        if(!(key.includesOf(["prefix", "verify", "swear", "anti-invite", "anti-spam", "sourcebin"]))) return;
        let check = await client.functions.awaitReply(message, `Would you like to disable the ${key} feature?`);
        if(!check) return;
        if(!(check.includesOf(client.yes))) return message.inlineReply("`❌` It appears that you did not say **yes**, thus cancelling the command.", { allowedMentions: { repliedUser: false } });
        let db = await message.client.quickdb.get(`settings.${message.guild.id}.${key}`);
        if(!(db)) return message.inlineReply(`\`❌\` It appears that **${key} feature** is already disabled, thus cancelling the command.`, { allowedMentions: { repliedUser: false } });
        return message.inlineReply(`\`${key} setting\` successfully \`disabled\``, { allowedMentions: { repliedUser: true } })
        .then(async() => {
          await message.client.quickdb.delete(`settings.${message.guild.id}.${key}`);
        })
      }
      async function setting_edit(message, [key]){
        console.log("passed")
        if(!(key.includesOf(["prefix", "verify", "swear", "anti-invite", "anti-spam", "sourcebin"]))) return;
        if(key === "prefix") {
          let prefix = await client.functions.awaitReply(message, "What is the bot's new prefix supposed to be?");
          if(!prefix) return;
          if(!(prefix.match(/^([`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\w]+:?[a-zA-Z0-9]{1,6})$/gi))) return message.inlineReply("`❌` It seems that prefix is commonly used, please used a unique one.", { allowedMentions: { repliedUser: false } });
          return message.inlineReply(`\`${key} setting\` successfully settled to \`${prefix}\``, { allowedMentions: { repliedUser: true } })
          .then(async() => {
            await message.client.quickdb.set(`settings.${message.guild.id}.${key}`, prefix);
          })
        } else if(key === "verify"){
          let verify = await client.functions.awaitReply(message, "What would the user's role be if they join?");
          if(!verify) return;
          let role = await await client.util.searchRole(message, verify);
          if(!role || role.length === 0) return message.inlineReply("`❌` That role was nowhere to be found.", { allowedMentions: { repliedUser: false } });
          return message.inlineReply(`\`${key} setting\` successfully settled to <@&${role.id}>`, { allowedMentions: { repliedUser: true } })
          .then(async() => {
            await message.client.quickdb.set(`settings.${message.guild.id}.${key}`, role.id);
          })
        } else if(key === "swear"){
          let verify = await client.functions.awaitReply(message, `Would you like to use the ${key} feature?`);
          if(!verify) return;
          if(!(verify.includesOf(client.yes))) return message.inlineReply("`❌` It appears that you did not say **yes**, thus cancelling the command.", { allowedMentions: { repliedUser: false } });
          return message.inlineReply(`\`${key} setting\` successfully \`enabled\``, { allowedMentions: { repliedUser: true } })
          .then(async() => {
            await message.client.quickdb.set(`settings.${message.guild.id}.${key}`, "enabled");
          })
        } else if(key === "anti-invite"){
          let verify = await client.functions.awaitReply(message, `Would you like to use the ${key} feature?`);
          if(!verify) return;
          if(!(verify.includesOf(client.yes))) return message.inlineReply("`❌` It appears that you did not say **yes**, thus cancelling the command.", { allowedMentions: { repliedUser: false } });
          return message.inlineReply(`\`${key} setting\` successfully \`enabled\``, { allowedMentions: { repliedUser: true } })
          .then(async() => {
            await message.client.quickdb.set(`settings.${message.guild.id}.${key}`, "enabled");
          })
        } else if(key === "anti-spam"){
          let verify = await client.functions.awaitReply(message, `Would you like to use the ${key} feature?`);
          if(!verify) return;
          if(!(verify.includesOf(client.yes))) return message.inlineReply("`❌` It appears that you did not say **yes**, thus cancelling the command.", { allowedMentions: { repliedUser: false } });
          return message.inlineReply(`\`${key} setting\` successfully \`enabled\``, { allowedMentions: { repliedUser: true } })
          .then(async() => {
            await message.client.quickdb.set(`settings.${message.guild.id}.${key}`, "enabled");
          })
        } else return console.log("wrong arguments")
      }
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "configuration",
  description: "Configuring bot",
  examples: [],
  usage: ["<option(setting|channel)>", "<action(set|unset)>"],
  type: []
};

exports.conf = {
  aliases: ["conf", "setting"],
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
  user: ["ADMINISTRATOR"]
};