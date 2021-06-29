/* Modules */
const Discord = require("discord.js-light"),
 color = require("../../storage/color"),
 util = require("./utils");

const PrettyError = require("pretty-error"),
pe = new PrettyError();
pe.withoutColors(); /**
pe.filter(function(traceLine, lineNumber){
  // the 'what' clause is something like:
  // 'DynamicTimeline.module.exports.DynamicTimeline._verifyProp'
  if (typeof traceLine.what !== 'undefined'){

      // we can shorten it with a regex:
      traceLine.what = traceLine.what.replace(
        /(.*\.module\.exports\.)(.*)/, '$2'
      );
  }
});

 * Static class with utilities used throughout the bot.
 */
class Functions{
	constructor() {
	  throw new Error("Functions is a static class and cannot be instantiated.");
  }

  static async translate (message, text) {
		if(!message) {
		  throw new ReferenceError("Shikishima => 'message' must be passed down as param! (translate)");
    }
		if(!text) {
		  throw new ReferenceError("Shikishima => 'text' must be passed down as param! (translate)");
    }
    const fetch = require("node-fetch"),
    cheerio = require("cheerio");
    let languages = await message.client.quickdb.get(`languages.${message.guild.id}.${message.author.id}`);
    const body = await fetch(`https://translate.google.com/m?sl=auto&tl=${languages? languages.id : "en"}&hl=en-US&q=${encodeURIComponent(text)}`)
    .then((res) => res.text())
    .then((html) => cheerio.load(html));
    if (!body) return "I could'nt find that languages, maybe try something that really exists.";
    const results = body("div.result-container").text();
    const lang = body("div.sl-and-tl a").last().text();

    return results;

  }

  static async sendLogs(message, error, type) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (sendLog)");
    }
    if(!error) {
      throw new ReferenceError("Shikishima => 'error' must be passed down as param! (sendLog)");
    }
    if(!type) {
      throw new ReferenceError("Shikishima => 'type' must be passed down as param! (sendLog)");
    }

    let name = error.name || "N/A";
    let code = error.code || "N/A";
    let httpStatus = error.httpStatus || "N/A";
    let stack = pe.render(error) || "N/A";
    let content = message.content || "N/A";
    let avatar;

    if(name.includes("TypeError")) {
      name = "Type Error";
      avatar = "https://i.imgur.com/KplPh0v.png";
    } else
    if(name.includes("DiscordAPIError")) {
      name = "DiscordApi Error";
      avatar = "https://i.imgur.com/B4DLa65.png";
    } else
    if(name.includes("MISSING_PERMISSIONS")) {
      name = "Missing Permission";
      avatar = "https://i.imgur.com/AHhWpZM.png";
    } else
    if(name.includes("FetchError")) {
      name = "Fetch Error";
      avatar = "https://i.imgur.com/VbMK69L.png";
    } else
    if(error.stack.includes("fetch the api")) {
      name = "Api Error";
      avatar = "https://i.imgur.com/zA5WdW1.png";
    } else {
      avatar = "https://i.imgur.com/a3f0ftB.png";
    }
    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.log`);
    let channel = await message.client.util.searchChannel(message, setting);

    const errors = message.client.util.BaseEmbed(message)
    .setAuthor(await this.translate(message, "An problem happens when you were executing the command."), client.user.displayAvatarURL({ size: 4096, dynamic: true }), "https://discord.io/Nekoyasui")
    //.addField(await this.translate(message, "Code"), code, true)
    //.addField(await this.translate(message, "http status"), httpStatus, true)
    //.addField(await this.translate(message, "Timestamp"), util.Log().fullDate(), true)
    //.addField(await this.translate(message, "Command executed"), content, true)
    .setDescription(`\`\`\`xl\n${stack}${channel ? `  - guild report: ${client.util.cleanGuildName(message.guild.name)}` : ""}  - command executed: ${content}\`\`\` `)
    .setColor(type === "error" ? color.red : color.orange);

    if (!(setting) || !(channel)) {
      const log = util.BaseEmbed(message)
      .setTitle(await this.translate(message, "Moderation Logs are not existed"))
      .setColor(message.client.color.orange)
      .setFooter("This message will be deleted in one minute");
      return message.client.util.sendWebhook(message, errors || "I'm gay", { username : name, avatar : avatar});
      //return message.channel.send(log).then(message => {message.delete({ timeout: 10000 })});
    } else {
      return message.client.util.sendWebhook(message, errors || "I'm gay", { channel : channel, username : name, avatar : avatar});
    }
  }

  static async awaitReply (message, question, limit = 360000) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (awaitReply)");
    }
		if(!question || question.length === 0) {
      throw new ReferenceError("Shikishima => 'question' must be passed down as param! (awaitReply)");
    }

    if(!message.author || message.author.bot || message.author.id === message.client.user.id) return;
    let response;
    const filter = (user) => {
      return user.author.id === message.author.id;
    };
    const questions = await message.channel.send(await this.translate(message, question ? `**${question}**` : ""));
    const guide = await message.channel.send(await this.translate(message, "Type \`cancel\` to cancel the command."));

    await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] })
    .then(async (reply) => {
      if(reply.first().content.toLowerCase().includes("cancel")){
        const member = await message.client.util.searchMember(message, message.author.id);
        if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return undefined;
          await new Promise(resolve => setTimeout(resolve, 500));
          const responds = await message.channel.messages.fetch({ limit: 2 });
          const flushablem = responds.filter(m => m.author.id === member.user.id);
          await message.channel.bulkDelete(flushablem, true);
          await new Promise(resolve => setTimeout(resolve, 100));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter(m => m.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
        }
        if(message.channel.permissionsFor(message.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])){
          message.react("👍");
        } else {
          guide.delete();
          await new Promise(resolve => setTimeout(resolve, 100));
          questions.edit(await this.translate(message, "`👍` Command cancelled."));
        } return undefined;
      } else {
        response = reply.first().content;
      }
    }).catch(async() => {
      guide.delete();
      await new Promise(resolve => setTimeout(resolve, 100));
      questions.edit(await this.translate(message, "Welp, You took too long, so the command was cancelled."));
      return undefined;
    });

    if(response){
      const member = await message.client.util.searchMember(message, message.author.id);
      if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return null;
          await new Promise(resolve => setTimeout(resolve, 500));
          const responds = await message.channel.messages.fetch({ limit: 2 });
          const flushablem = responds.filter(m => m.author.id === member.user.id);
          await message.channel.bulkDelete(flushablem, true);
          await new Promise(resolve => setTimeout(resolve, 100));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter(m => m.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
      }
    } else { return undefined; }

    return response;
  };

  static async awaitPrompt (message, questions, limit = 360000) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (awaitPrompt)");
    }
		if(!question || question.length === 0) {
      throw new ReferenceError("Shikishima => 'questions' must be passed down as param! (awaitPrompt)");
    }

    let response = [];
    new Promise(async resolve => {
      resolve(2);
      try {
        for (let i = 0; i < questions.length; i++) {
          let application = await this.awaitReply(message, questions[i], limit);
          if(application) {
            await new Promise(resolve => setTimeout(resolve, 800));
            response.push(application);
            continue;
          } else {
            response = undefined;
            break;
          }
        }
      } catch(e) {
        response = undefined;
      }
    })

    if(!response){
      return undefined;
    } else {
      return response;
    }
  };

  static async awaitRole (message, question, limit = 360000) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (awaitRole)");
    }
		if(!question || question.length === 0) {
      throw new ReferenceError("Shikishima => 'content' must be passed down as param! (awaitRole)");
    }

    if(!message.author || message.author.bot || message.author.id === message.client.user.id) return;

    const questions = await message.channel.send(await this.translate(message, question ? `**${question}**` : ""));
    const guide = await message.channel.send(await this.translate(message, `${client.config.emojis.loading} To continue, please assign yourself a role.`));

    let role;
    try {
      role = await new Promise((resolve, reject) => {
        let timeout = this.timeout(limit, reject);
        console.log(timeout)
        let listener = async(oldMember, member) => {
          if(oldMember.id == message.author.id) {
            let diff = member.roles.cache.difference(oldMember.roles.cache);
            if(diff.size == 1) {
              client.removeListener('guildMemberUpdate', listener);
              resolve(diff.first());
            }
          }
        }
        client.on('guildMemberUpdate', listener);
      });
    } catch(e){
      guide.delete();
      await new Promise(resolve => setTimeout(resolve, 100));
      questions.edit(await this.translate(message, "Welp.. you took too long, cancelling the command."));
      role = undefined;
    };

    if(!role) return undefined;

    let response = await message.client.util.searchRole(message, role.id);
    if(response){
      const member = await message.client.util.searchMember(message, message.author.id);
      if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return null;
          await new Promise(resolve => setTimeout(resolve, 100));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter(m => m.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
      }
    } else { return undefined; }

    return response;
  };

  static async awaitReaction (message, question, limit = 360000) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (awaitRole)");
    }
		if(!question || question.length === 0) {
      throw new ReferenceError("Shikishima => 'content' must be passed down as param! (awaitRole)");
    }

    if(!message.author || message.author.bot || message.author.id === message.client.user.id) return;

    const questions = await message.channel.send(await this.translate(message, question ? `**${question}**` : ""));
    const guide = await message.channel.send(await this.translate(message, `${message.client.config.emojis.loading} To continue, please react to the message.`));

    let reaction = {};
    try {
			reaction = await new Promise((resolve, reject) => {
				this.timeout(limit, reject);
				let listener = async(packet) => {
					//console.log('packet', packet);
					if(packet.t === 'MESSAGE_REACTION_ADD') {
						if(packet.d.user_id == message.author.id) {
							//console.log('should resolve', packet.d);
							client.removeListener('raw', listener);
							resolve(packet.d);
						}
					}
				}
				client.on('raw', listener);
			});
    } catch(e){
      guide.delete();
      await new Promise(resolve => setTimeout(resolve, 100));
      questions.edit(await this.translate(message, "Welp.. you took too long, cancelling the command."));
      reaction = undefined;
    };
    if(reaction){
      const member = await message.client.util.searchMember(message, message.author.id);
      if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return null;
          await new Promise(resolve => setTimeout(resolve, 100));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter(m => m.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
      }
    } else { return undefined; }

    return reaction;
  };

  static timeout (time, reject) {
    let to = setTimeout(() => {
      clearTimeout(to);
      reject(`Exceeded time limit.`);
    }, time);
    return to;
  }

  static async awaitImage (message, question, limit = 360000) {
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (awaitImage)");
    }
		if(!question || question.length === 0) {
      throw new ReferenceError("Shikishima => 'question' must be passed down as param! (awaitImage)");
    }

    if(!message.author || message.author.bot || message.author.id === client.user.id) return;
    let response = {};
    const filter = (user) => {
      return user.author.id === message.author.id;
    };
    const questions = await message.channel.send(await this.translate(message, question ? `**${question}**` : "")).then(async() => message.channel.send(await this.translate(message, "Type \`cancel\` to cancel the command.")));

    await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] })
    .then(async (reply) => {
      if(reply.first().content.toLowerCase().includes("cancel")){
        const member = await message.client.util.searchMember(message, message.author.id);
        if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return undefined;
          const responds = await message.channel.messages.fetch({ limit: 1 });
          const flushablem = responds.filter((user) => user.author.id === member.user.id);
          await message.channel.bulkDelete(flushablem, true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter((user) => user.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
        }
        if(message.channel.permissionsFor(message.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])){
          message.react("👍");
        } else {
          questions.edit(util.BaseEmbed(message).setColor(color.yellow).setTitle(await this.translate(message, "`👍` Command cancelled.")));
        } return undefined;
      } else {
        let image = new RegExp(/(http(|s):.*\.(jpg|png|jpeg|gif))/i);
        if (image.test(reply.first().content)) {
          response = reply.first().content.split(image)[1];
        } else {
          response = reply.first().attachments.first().url
        }
        console.log("image", response)
      }
    }).catch(async() => {
      guide.delete();
      await new Promise(resolve => setTimeout(resolve, 100));
      questions.edit(await this.translate(message, "Welp.. you took too long, cancelling the command."));
      response = undefined;
    });

    if(response){
      const member = await message.client.util.searchMember(message, message.author.id);
      if(member && message.guild.me.hasPermission(["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"])) {
        if(!member.user.id) return null;
          await new Promise(resolve => setTimeout(resolve, 1000));
          const messages = await message.channel.messages.fetch({ limit: 3 });
          const flushable = messages.filter((user) => user.author.id === message.client.user.id);
          await message.channel.bulkDelete(flushable, true);
      }
    } else { return undefined; }

    return response;
  };

  static async permissionsFor(message, { role, permission = [] } = {}){
    if(message.guild.ownerID === message.author.id) return true;
    if(role && !(typeof role === "string" || Array.isArray(role))) throw new SyntaxError("Shikishima => 'role' must be a string|array type! (permissionsFor)");
    if(permission && !Array.isArray(permission)) throw new SyntaxError("Shikishima => 'permission' must be a array type! (permissionsFor)");
    if(!(role || permission)) throw new ReferenceError("Shikishima => 'role' OR 'permission' must be passed down as param! (permissionsFor)");


    if(!role){
      if (permission && permission.length > 0 && !message.member.hasPermission(permission !== "" ? permission : "SEND_MESSAGES")) {
          const permissions = `${message.member.permissions.missing(permission).join(", ").replace(/_/gi, " ")}`;
          const embed = message.client.util.BaseEmbed(message)
              .setTitle(`${message.author.username} Permission`)
              .setColor(message.client.color.orange)
              .setDescription(`\`🚫\` You don't have Permission to use this Command.`)
              .addField("Permission:", `\`\`\`${permissions}\`\`\``);
              client.util.sendWebhook(message, embed)
          return false;
      } else return true;
    } else {
      let check = await messageclient.util.checkUserRoles(message, { user: message.author.id, roles: role});
      if(!(check)) {
        
          const embed = message.client.util.BaseEmbed(message)
              .setTitle(`${message.author.username} Permission`)
              .setColor(message.client.color.orange)
              .setDescription(role ? `\`🚫\` You don't have <@&${role}> role to use this Command.` : "Looks like this role is an Array");
              client.util.sendWebhook(message, embed)
          return false;
      } else return true;
    }
  }

  static async argsFor(message, { args = [], usages = [], examples = [] } = {}){
    let argument = [], missing = [];
    new Promise(async resolve => {
      resolve(2);
      try{
          for (let i = 0; i < usages.length; i++) {
              if (!(args[i] === undefined)) argument.push(args[i]);
              if (args[i] === undefined) missing.push(args[i]);
          }
      } catch {}
    })
    let required = `${argument.join(" ")} ${missing.join(" ")}`;
    if (missing && missing.length > 0) {
        const embed = client.util.BaseEmbed(message)
            .setTitle("Incorrect command usage")
            .setColor(client.color.orange)
            .setDescription("`📛` You must provide more arguments.")
            .addField("Arguments:", `\`\`\`${required}\`\`\``);

            if (usages && usages.length > 0){
                const usage = usages.map((usage) => `${usage}`).join(", ");
                embed.addField("Usage:", `\`\`\`${usage}\`\`\``)
            }
            if (examples && examples.length > 0){
                const example = examples.map((ex) => `${message.client.user.username} ${ex}`).join("\n");
                embed.addField("Example:",`\`\`\`${example}\`\`\``);
            }

        client.util.sendWebhook(message, embed)
        return false;
    } else return true;
  }
  
  static async slowmode(message, { channel = undefined, time = "clear" } = {}){
    if(!message) {
      throw new ReferenceError("Shikishima => 'message' must be passed down as param! (slowmode)");
    }
    if(!time) {
      throw new ReferenceError("Shikishima => 'time' must be passed down as param! (slowmode)");
    }
    if(!channel) channel = message.channel.id;
    channel = await message.client.util.searchChannel(message, channel);
    if(!(channel)) return;
    if (!(message.guild.me.permissionsIn(channel).has("MANAGE_CHANNELS"))){
      console.log("Shikishima => I don\'t have the permission to set SlowMode!");
    }

    const ms = require("ms");
      const type = phrase => {
      if (phrase === undefined || !phrase.length) return undefined;
      if (ms(phrase) === 0 || ms(phrase) > 1000) return ms(phrase);
      let parsedTime = 0;
      const words = phrase.split(' ');
      for (const word of words) {
        if (ms(word) === 0 || ms(word) > 1000) parsedTime += ms(word);
        else return undefined;
      }
      return parsedTime;
    }
    time = type(time);
		await channel.setRateLimitPerUser(time / 1000).then(() => console.log("done")).catch((e) => console.log(e));
  }
}
module.exports = Functions;