
const Discord = require("discord.js-light"),
fetch = require("node-fetch"),
axios = require("axios"),
ms = require("ms"),
{ CHATBOT_ID, CHATBOT_KEY } = process.env;

const type = phrase => {
  if (phrase === undefined || !phrase.length) return undefined;
  if (ms(phrase) === 0 || ms(phrase) > 1000) return ms(phrase);
  let parsedTime = 0;
  const words = phrase.split(" ");
  for (const word of words) {
    if (ms(word) === 0 || ms(word) > 1000) parsedTime += ms(word);
    else return undefined;
  }
  return parsedTime;
}

module.exports = (client) => {
  try {
    client.on("message", async message => {
      if( !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
      if (!message.channel.permissionsFor(message.guild.me).has(["SEND_MESSAGES"])) return;

      //Checking cleverbot feature to be enabled.
      const setting = await message.client.quickdb.get(`channels.${message.guild.id}.cleverbot`);
      const channel = await client.util.searchChannel(message, setting);
      const master = await client.util.searchUser(message, "817238971255488533"); 
      const cooldown = "3s";

      //So we going to get bot prefix
      const serverPrefix = await message.client.quickdb.get(`settings.${message.guild.id}.prefix`);
      const mentionRegex = new RegExp(`^(<@!?${client.user.id}>|${client.user.username.fixedUsername()})`, "i", "(\s+)?");
      const commandRegex = new RegExp(`^(${serverPrefix ?`${serverPrefix}|`: ""}<@!?${client.user.id}>|${client.user.username.fixedUsername()}|<@!?${message.author.id}> cmd|${message.author.username.fixedUsername()} cmd)`, "i", "(\s+)?");


      //Check if used commands
      if(!(channel && channel.id === message.channel.id)){
        usedPrefix = message.content.match(mentionRegex);
        usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
      if(!(message.mentions.users.first().id === client.user.id) && !usedPrefix) return;
      } else {
        usedPrefix = message.content.match(commandRegex);
        usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];
        if(usedPrefix) return;
      }

      //Check if your using prefix or not
      let args, commandName, params;
      if(usedPrefix) {
        args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
        commandName = args[0].toLowerCase();
        params = args.join(" ").toLowerCase();
      } else {
        params = message.content.trim().toLowerCase();
        args = message.content.trim().split(/ +/g);
        commandName = args.shift().toLowerCase();
      }

      if(commandName.length){
        let commands = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName)) || undefined;
        if(commands || await message.client.quickdb.get(`tag.${message.guild.id}.${commandName}`)) {
        
            return message.channel.stopTyping();
        }
      }
      
      const chat = {
        message: params,
        uid: message.author.id,
        /*author: {
          id: message.author.id,
          username: message.author.username,
          discriminator: message.author.discriminator
        },*/
        bot: {
          name: client.user.username.fixedUsername(),
          birthdate: "11/2/2002",
          prefix: serverPrefix,
          gender: "male",
          description: "I'm a Multipurpose Discord Bot with many features.",
          info: {
            discord : true
          }
        }
      };

      const getting = await fetch("https://api.nekoyasui.ga/post/chat", {
      method: "POST",
        body: JSON.stringify(chat),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json()).catch(() => {});
      console.log(getting);
      if(getting.success) {
        // Start typing
        message.channel.startTyping();
        if (message.guild.me.permissionsIn(message.channel).has("MANAGE_CHANNELS")) {
          await message.channel.setRateLimitPerUser(type(cooldown) / 1000);
        }
        // Add a 2s delay
        await new Promise(resolve => setTimeout(resolve, ms(cooldown)));

        message.inlineReply(getting.data, { allowedMentions: { repliedUser: false } });

        if (message.guild.me.permissionsIn(message.channel).has("MANAGE_CHANNELS")) {
          await message.channel.setRateLimitPerUser(type("clear") / 1000);
        }
        return message.channel.stopTyping();
      }
    })
  } catch (e) {
  client.util.Log().error("Chat Brainshop Module", `${e.name}: ${e.stack}`);
  }
}