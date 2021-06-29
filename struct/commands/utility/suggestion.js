const gen = require("@codedipper/random-code");

exports.run = async (client, message, Discord, [key, ...value]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.

    if(!value || value.length === 0) { value = undefined; }
    const Method = key ? key.toLowerCase() : "";
    switch (Method) {
        case "set":
        check = await client.functions.permissionsFor(message, { permission: ["ADMINISTRATOR"] });
        if(!check) return;
            await setting(message, value);
        break;
        case "reply":
            await reply(message, value);
        break;
        default:
            if(!(Method.length === 0)) return;
            await suggestion(message);
        break;
    }

    async function setting(message, value){
        let param;
        if(!value) { param = message.channel.id; } else { param = value.join(" "); }
        
        let channel = await message.client.util.searchChannel(message, param, { current: true });
        if (!channel || !channel.id) return message.inlineReply("`❌` That channel cannot be found on this server.");
        if(!(channel.permissionsFor(message.client.user).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]))) return message.inlineReply("`❌` I can't post on that channel, because i don't have permission to do so.", { allowedMentions: { repliedUser: false } });

        let embed = message.client.util.BaseEmbed(message)
        .setColor(client.color.green)
        .setAuthor(`${client.util.cleanGuildName(message.guild.name)}`, message.guild.iconURL({ size: 4096, dynamic: true }))
        .setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
        .addField("❯ " + await message.client.functions.translate(message, `Suggesting rules.`), require("common-tags").stripIndents(`
            **•** You cannot suggest the same stuff again under the time span of 72 Hours
            **•** You need to check whether someone has already requested for the same suggestion.
            `))
        .addField(`\u200b`, `To submit suggestion \`\`${message.client.user.username} suggestion\`\``)
        .setFooter(`Suggestions`, message.guild.iconURL({ size: 4096, dynamic: true }))
        .setTimestamp();

        await message.client.quickdb.set(`suggestion.${message.guild.id}.channel`, channel.id);
        return channel.send(embed);
    }

    async function reply(message, value){
        let suggestion = {}, reply;
        if(value) {
          let content = value.join(" ");
          for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined)) {
              suggestion = await message.client.quickdb.get(`suggestion.${message.guild.id}.${value[i]}`);

              if(!(suggestion)) { continue; } else {
                let found = content.match(suggestion.token);
                found = found && found.length && found[0];

                if(!(found)) { continue; } else {
                  let param = content.slice(found.length).trim().split(/ +/g);
                  reply = param.join(" ");
                  break;
                }
              }
            }
          }
          if(!suggestion || suggestion.length === 0) return message.inlineReply("`❌` Please double-check that a valid suggestion token exists before proceeding.", { allowedMentions: { repliedUser: false } });
          if(suggestion.status === "success") {
            let replied = await client.util.searchMember(message, suggestion.replied);
            return message.inlineReply(`Suggestion has already been answered by ${replied.user.tag}`, { allowedMentions: { repliedUser: false } });
          }
          let member = await client.util.searchMember(message, suggestion.user);
          if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
          let embed = client.util.BaseEmbed(message)
            .setColor(client.color.green)
            .setAuthor(`${member.user.tag} | ${member.user.id}`, member.user.displayAvatarURL({ size: 4096, dynamic: true }))
            .setDescription(require("common-tags").stripIndents([
                suggestion.description ? suggestion.description : null
            ].join("\n")))
            .addField(`Reply By ${member.user.tag} | ${member.user.id} `, reply)
            .setFooter(`Suggestion Token: ${suggestion.token}`, message.guild.iconURL({ size: 4096, dynamic: true }))
            .setTimestamp();
          
          let channelID = await message.client.quickdb.get(`suggestion.${message.guild.id}.channel`),
          channel = await message.client.util.searchChannel(message, channelID);
          console.log(channel)
          if(!channel) {
              await message.client.quickdb.delete(`suggestion.${message.guild.id}.channel`);
              return message.inlineReply("`❌` That suggestion token is invalid, please ensure that one exists before continuing.")
          }
          channel.messages.fetch(suggestion.id).then(async(m) => {
            m.edit(embed);
            member.send(`You have an admin answer to your suggestion.\nhttps://discord.com/channels/${message.guild.id}/${channel.id}/${suggestion.id}`);
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${suggestion.token}.status`, "success");
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${suggestion.token}.replied`, message.author.id);
            //await new Promise(resolve => setTimeout(resolve, 500));
            //await client.quickdb.delete(`suggestion.${message.guild.id}.${suggestion.token}`);
            message.inlineReply(`successfully replyed to suggestion.`);
          })
        }
    }

    async function suggestion(message){
        let channelID = await message.client.quickdb.get(`suggestion.${message.guild.id}.channel`),
        channel = await message.client.util.searchChannel(message, channelID);
        if(!channel) {
            await message.client.quickdb.delete(`suggestion.${message.guild.id}.channel`);
            return message.inlineReply("`❌` I'm could'nt find a suggestion channel, please ensure that one exists before continuing.", { allowedMentions: { repliedUser: false } })
        }

        const questions = [
          ,
          "Is this a suggestion related to javascript?"
        ];
        let description = await client.functions.awaitReply(message, "Tell me what you're thinking, and make sure everyone understands that.");
        if(!description) return;
        if(description.length < 5) return message.inlineReply("`❌` The length of your suggestion has to be more than 10.", { allowedMentions: { repliedUser: false } });
        const suggestion = {
          description: description,
          notice: ""
        }, token = gen(10);

        console.log(`Description: ${suggestion.description}\nRelated: ${suggestion.related}\nToken: ${token}`);

        let embed = message.client.util.BaseEmbed(message)
        .setColor(client.color.green)
        .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({size: 4096, dynamic: true}))
        .setDescription(require("common-tags").stripIndents([
            suggestion.description ? suggestion.description : null
        ].join("\n")))
        .setFooter(`Suggestion Token: ${token}`, message.guild.iconURL({ size: 4096, dynamic: true }))
        .setTimestamp();

        return channel.send(embed).then(async(m) => {
            if(channel.permissionsFor(message.client.user).has(["ADD_REACTIONS", "READ_MESSAGE_HISTORY"])){
                if(channel.permissionsFor(message.client.user).has(["USE_EXTERNAL_EMOJIS"])) {
                    m.react(message.client.config.emojis.upvote);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    m.react(message.client.config.emojis.downvote);
                } else {
                    m.react("👍");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    m.react("👎");
                }
            }
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${token}.id`, m.id);
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${token}.token`, token);
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${token}.description`, suggestion.description);
            //await message.client.quickdb.set(`suggestion.${token}.related`, suggestion.related);
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${token}.status`, "pending");
            await message.client.quickdb.set(`suggestion.${message.guild.id}.${token}.user`, message.author.id);

            message.author.send(`\`\`\`Guild : ${client.util.cleanGuildName(message.guild.name)}\`\`\`Suggestion has been created. You agreed to receive an admin reply to your suggestion.`)
            return message.inlineReply(`successfully submited your suggestion`, { allowedMentions: { repliedUser: false } });
        });
    }
  } catch (e) { // End of the Code.
    message.client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "suggestion",
  description: "Suggest anything you want to.",
  examples: ["<value>", "reply <code> <value>", "set <#channel>"],
  usage: ["<option(reply|set)>"],
  type: []
};

exports.conf = {
  aliases: ["suggest","request"],
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
