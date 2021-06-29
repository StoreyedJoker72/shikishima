const gen = require("@codedipper/random-code");

exports.run = async (client, message, Discord, [key, ...value]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.

    if(!value || value.length === 0) { value = undefined; }
    const Method = key ? key.toLowerCase() : "";
    let check;
    switch (Method) {
        case "set":
        check = await client.functions.permissionsFor(message, { permission: ['ADMINISTRATOR'] });
        if(!(check)) return;
            await setting(message);
        break;
        case "reply":
            await reply(message, value);
        break;
        default:
            if(!(Method.length === 0)) return;
            await apply(message);
        break;
    }
    async function setting(message){
        let botChannel = await client.functions.awaitReply(message, "What channel would you like to set up for posted bot submissions?");
        if(!botChannel) return;
        let channel = await message.client.util.searchChannel(message, botChannel, { current: true });
        if (!channel || !channel.id) return message.inlineReply("`❌` That channel cannot be found on this server.", { allowedMentions: { repliedUser: false } });
        let botRole = await client.functions.awaitReply(message, "What role would you like to be required to use this command?", { allowedMentions: { repliedUser: false } });
        if(!botRole) return;
        let role = await message.client.util.searchRole(message, botRole);
        if (!role || !role.id) return message.inlineReply("`❌` That role cannot be found on this server.");
        let devRole = await client.functions.awaitReply(message, "What role would you like to be added after the submissions accepted", { allowedMentions: { repliedUser: false } });
        if(!devRole) return;
        let roleDev = await message.client.util.searchRole(message, devRole);
        if (!roleDev || !roleDev.id) return message.inlineReply("`❌` That role cannot be found on this server.", { allowedMentions: { repliedUser: false } });
        let embed = message.client.util.BaseEmbed(message)
        .setColor(client.color.green)
        .setAuthor(`${client.util.cleanGuildName(message.guild.name)}`, message.guild.iconURL({ size: 4096, dynamic: true }))
        //.setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
        .addField("❯ " + await message.client.functions.translate(message, `Bot Submissions rules.`), require("common-tags").stripIndents(`
        **•** Only you should use the owner-only command.
        **•** You need to check if someone has already used your bot prefix.
        **•** Bots that are NSFW are permitted, but they must be strictly prohibited.
        **•** The bot must be public, but you can make it private after we've tested it.
        **•** The bot must be unique and not have been forked from another GitHub repository.
        **•** Discord Bot Builder is not permitted.
        `))
        .addField(`\u200b`, `To submit bot \`\`@${message.client.user.username} apply\`\``)
        .setFooter(`Bot Submissions`, message.guild.iconURL({ size: 4096, dynamic: true }))
        .setTimestamp();

        await message.client.quickdb.set(`application.${message.guild.id}.channel`, channel.id);
        await message.client.quickdb.set(`application.${message.guild.id}.role.reviewer`, role.id);
        await message.client.quickdb.set(`application.${message.guild.id}.role.developer`, roleDev.id);
        return channel.send(embed);
    }

    async function reply(message, value){
        let application = {}, reply;
        if(value) {
          let content = value.join(" ");
          for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined)) {
              application = await message.client.quickdb.get(`application.${message.guild.id}.${value[i]}`);

              if(!(application)) { continue; } else {
                let found = content.match(application.token);
                found = found && found.length && found[0];

                if(!(found)) { continue; } else {
                  let param = content.slice(found.length).trim().split(/ +/g);
                  if(!(param.length < 2)) { reply = param } else { reply = undefined;}
                  break;
                }
              }
            }
          }

          let channelID = await message.client.quickdb.get(`application.${message.guild.id}.channel`),
          channel = await message.client.util.searchChannel(message, channelID);
          if(!channel) {
              await message.client.quickdb.delete(`application.${message.guild.id}.channel`);
              return message.inlineReply("`❌` Bot submission channel is invalid, please ensure that one exists before continuing.", { allowedMentions: { repliedUser: false } })
          }
          let roleRevID = await message.client.quickdb.get(`application.${message.guild.id}.role.reviewer`),
          roleRev = await message.client.util.searchRole(message, roleRevID);
          if(!roleRev) {
              await message.client.quickdb.delete(`application.${message.guild.id}.role.reviewer`);
              return message.inlineReply("`❌` Bot reviewer role is invalid, please ensure that one exists before continuing.", { allowedMentions: { repliedUser: false } })
          }
          let checkrole = await client.functions.permissionsFor(message, { role: roleRev.id });
          if(!checkrole) return;
          let roleDevID = await message.client.quickdb.get(`application.${message.guild.id}.role.developer`),
          roleDev = await message.client.util.searchRole(message, roleDevID);
          if(!roleDev) {
              await message.client.quickdb.delete(`application.${message.guild.id}.role.developer`);
              return message.inlineReply("`❌` Bot developer role is invalid, please ensure that one exists before continuing.", { allowedMentions: { repliedUser: false } })
          }

          if(!application || application.length === 0) return message.inlineReply("`❌` Please double-check that a valid bot submission token exists before proceeding."), { allowedMentions: { repliedUser: false } };
          if(application.status === "success") {
            let replied = await client.util.searchMember(message, application.replied);
            return message.inlineReply(`Bot Submission has already been answered by ${replied.user.tag}`, { allowedMentions: { repliedUser: false } });
          }
          let member = await client.util.searchMember(message, application.user);
          if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
          let embed = client.util.BaseEmbed(message)
            .setColor(reply ? client.color.red : client.color.green)
            .setTitle("Discord Bot Submissions")
            .setThumbnail(application.avatar)
            .setDescription(require("common-tags").stripIndents([
              application.description ? application.description : null,
              "\n**❯ Information**",
              application.id ? `• ID: **${application.id}**` : null,
              application.username ? `• Username: **${application.username}**` : null,
              application.prefix ? `• Prefix: **${application.prefix}**` : null,
              `• Created: **${member.user.tag}**`,
            ].join("\n")))
            .addField(`**❯ Bot ${reply ? "Declined" : "Accepted"}**`, `
            • ${roleRev ? roleRev.name.toProperCase() : "Moderator"} : <@!${message.author.id}>
            ${reply ? `• Reason : ${reply.join(" ")}` : ""}`)
            .setFooter(`Bot Submissions Token: ${application.token}`, message.guild.iconURL({ size: 4096, dynamic: true }));

          channel.messages.fetch(application.id).then(async(m) => {
            m.edit(embed);
            member.send(`You have an admin answer to your application.\nhttps://discord.com/channels/${message.guild.id}/${channel.id}/${application.id}`);
            await message.client.quickdb.set(`application.${message.guild.id}.${application.token}.status`, "success");
            await message.client.quickdb.set(`application.${message.guild.id}.${application.token}.replied`, message.author.id);
            if(!reply) member.roles.add(roleDev.id)
            //await new Promise(resolve => setTimeout(resolve, 500));
            //await client.quickdb.delete(`application.${message.guild.id}.${application.token}`);
            message.inlineReply(`successfully replyed to application.`, { allowedMentions: { repliedUser: false } });
          })
        }
    }

    async function apply(message){
        let channelID = await message.client.quickdb.get(`application.${message.guild.id}.channel`),
        channel = await message.client.util.searchChannel(message, channelID);
        if(!channel) {
            await message.client.quickdb.delete(`application.${message.guild.id}.channel`);
            return message.inlineReply("`❌` I'm could'nt find a bot submissions channel, please ensure that one exists before continuing.", { allowedMentions: { repliedUser: false } })
        }

        let botID = await client.functions.awaitReply(message, "What is the id of your bot?");
        if(!botID) return;
        let check = await client.util.searchUser(message, botID);
        if(!(check)) return message.inlineReply("`❌` Invalid Bot ID, you need to provide the correct ID.", { allowedMentions: { repliedUser: false } });
        let botPrefix = await client.functions.awaitReply(message, "What is your bot prefix?");
        if(!botPrefix) return;
        let botDescription = await client.functions.awaitReply(message, "Give me a brief description of your bot.");
        if(!botDescription) return;
        if(botDescription.length < 34) return message.inlineReply("`❌` The character length of your bot description has to be more than 35.", { allowedMentions: { repliedUser: false } });
        if(botDescription.length > 225) return message.inlineReply("`❌` You are not expected to write an essay.", { allowedMentions: { repliedUser: false } });

        let fetch = require("node-fetch"), image;
        image = await fetch(`https://cdn.discordapp.com/avatars/${check.id}/${check.avatar}.gif?size=4096`).catch(() => null);
        if(!(image.status === 200)) image = await fetch(`https://cdn.discordapp.com/avatars/${check.id}/${check.avatar}.png?size=4096`).catch(() => null);

        let avatar = image ? image.url : 
          check.discriminator.endsWith(`0`) || check.discriminator.endsWith(`5`) ? `https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png` : check.discriminator.endsWith(`1`) || check.discriminator.endsWith(`6`) ? `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png` : check.discriminator.endsWith(`2`) || check.discriminator.endsWith(`7`) ? `https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png` : check.discriminator.endsWith(`3`) || check.discriminator.endsWith(`8`) ? `https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png` : check.discriminator.endsWith(`4`) || check.discriminator.endsWith(`9`) ? `https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png` : `Not Available`;

        const application = {
          id: check.id,
          username: check.username,
          avatar: avatar,
          prefix: botPrefix,
          description: botDescription,
          notice: ""
        }, token = gen(10);

        console.log(`Prefix: ${application.id}\nPrefix: ${application.prefix}\nDescription: ${application.description}\nToken: ${token}`);

        let embed = message.client.util.BaseEmbed(message)
        .setColor(client.color.green)
        .setTitle("Discord Bot Submissions")
        .setThumbnail(application.avatar)
        .setDescription(require("common-tags").stripIndents([
          application.description ? application.description : null,
          "\n**❯ Information**",
          application.id ? `• ID: **${application.id}**` : null,
          application.username ? `• Username: **${application.username}**` : null,
          application.prefix ? `• Prefix: **${application.prefix}**` : null,
          `• Created: **${message.author.tag}**`,
            
        ].join("\n")))
        .setFooter(`Bot Submissions Token: ${token}`, message.guild.iconURL({ size: 4096, dynamic: true }));

        return channel.send(embed).then(async(m) => {
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.id`, m.id);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.token`, token);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.bot`, application.id);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.username`, application.username);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.avatar`, application.avatar);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.prefix`, application.prefix);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.description`, application.description);
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.status`, "pending");
            await message.client.quickdb.set(`application.${message.guild.id}.${token}.user`, message.author.id);
            if(!(application.prefix.match(/^([`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\w]+:?[a-zA-Z0-9]{1,5})$/gi))) {
              application.notice = `\n\`⚠️\` It seems that the bot prefix is commonly used, make sure to change your prefix after your application is approved.`;
            }
            message.author.send(require("common-tags").stripIndents(`
            \`\`\`Guild : ${client.util.cleanGuildName(message.guild.name)}\`\`\`bot submissions has been created. You agreed to receive an admin reply to your application.
            ${application.notice ? application.notice : ""}
            `));
            return message.inlineReply(`successfully submited your application`, { allowedMentions: { repliedUser: false } });
        });
    }
  } catch (e) { // End of the Code.
    message.client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "apply",
  description: "Submit your bot",
  examples: ["<value>", "reply <code> <value>", "set"],
  usage: ["<option(reply|set)>"],
  type: []
};

exports.conf = {
  aliases: ["apply-bot"],
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
