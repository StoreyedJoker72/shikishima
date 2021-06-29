const fetch = require("node-fetch");
exports.run = async (client, message, Discord, args) => {

  try { // Put your Code below.

    const Method = args[0] ? args[0].toLowerCase() : "";
    switch (Method) {
      case "prompt-reply":
      const { prompt } = require("nekoyasui");
      const reply = await prompt.reply(message.channel, ["kek?", "keeeeek?"], { userID : message.author.id, includesOf : "kek"});
      return message.channel.send(reply);
      case "random-c":
      client.commands.random().run(client, message, Discord, args);
      break;
      case "announce":
      let found = 0;
      message.client.guilds.cache.forEach(async(g) => {
        console.log(g.name)
        g.channels.cache.map(async(c) => {
          if(found === 0) {
            if(c.type === "text") {
              if(g.me.hasPermission("SEND_MESSAGES")) {
                if(g.me.hasPermission("CREATE_INSTANT_INVITE")) {
                  invite = await c.createInvite({
                    maxAge: 0,
                    unique: true,
                    reason: "Joined Server."
                  })
                }
                found = 1; //Start getting guilds
                c.send("Join on my server, https://discord.com/invite/n6EnQcQNxg")
              }
            }
          }
        })
      })
      break;
      case "api":
        let chat = {
          message: "hi",
          uid: message.author.id,
          owner: {
            id: "817238971255488533",
            username: "Nekoyasui",
            discriminator: "6804"
          },
          bot: {
            name: "ochinchin",
            birthdate: "11/2/2002",
            prefix: ";",
            gender: "male",
            description: "I'm a Multi-purpose Bot with many features."
          }
        };

        const getting = await fetch("https://api.nekoyasui.ga/post/chat", {
          method: "POST",
            body: JSON.stringify(chat),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).catch(() => {});
        console.log(getting);
      break;
      case "daily":
async function daily(message, { name = "daily" } = {}) {
	const Discord = require("discord.js"),
		ms = require("parse-ms");
	const user = message.author;
	const timeout = 86400000;
	let {
		data
	} = await message.client.quickdb.fetch(`${name}.${message.guild.id}.${user.id}`);
	console.log(data)
	if((data) && timeout - (Date.now() - data) > 0) {
		let time = ms(timeout - (Date.now() - data));
		console.log(`You've already collected your ${name} reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s`);
		return false;
	} else {
		await message.client.quickdb.set(`${name}.${message.guild.id}.${user.id}`, Date.now());
		console.log(`You've collected your ${name} reward of 1000000000 coins`);
		return true;
	}
}
console.log(await daily(message));
break;
      case "multi":
      let multi = await client.util.checkUserRoles(message, { user: message.author.id, roles: ["817617704830894090", "817617706266132491"]});
      console.log(multi)
      break;
      case "search":
        const Option = args[1] ? args[1].toLowerCase() : "";
        switch (Option) {
          case "member":
            let member = await client.util.searchMember(message, args[2], { current: true });
            console.log(member);
            return message.channel.send(member.user.id);
          break;
          case "user":
            let user = await client.util.searchUser(message, args[2]);
            console.log(user);
            return message.channel.send(`${user.username}#${user.discriminator}`);
          break;
          case "channel":
            let channel = await client.util.searchChannel(message, args[2]);
            console.log(channel);
            return message.channel.send(channel.id);
          break;
          case "role":
            let role = await await client.util.searchRole(message, args[2]);
            if(!role) return;
            console.log(role);
            return message.channel.send(role.id);
          break;
          case "emoji":
            let emoji = await client.util.searchEmoji(message, args[2]);
            console.log(emoji);
            return message.channel.send(`<:${emoji.name}:${emoji.id}> \`\`<:${emoji.name}: ${emoji.id}>\`\``);
          break;
          default:
          return message.channel.send("wrong search option")
        }
      break;
      case "draw":
      const items = [{
        propability: 0.4,
        name: "Chopper" //'Item with propability 0.4%'
      }, {
        propability: 1,
        name: "Captain Price" //'Item with propability 1%'
      }, {
        propability: 2.5,
        name: "Type 25" //'Item with propability 2.5%'
      }, {
        propability: 3.1,
        name: "Emote" //'Item with propability 3.1%'
      }, {
        propability: 1.9,
        name: "Backpack" //'Item with propability 1.9%'
      }, {
        propability: 0.0001,
        name: "Calling Card" //'Item with propability 0.0001%'
      }];

      // get total probability
      let total = 0;
      for(let got in items) {
        total += items[got].propability;
      }

      // draw items
      function draw() {
        let pick = Math.random() * total;
        for(let got in items) {
          pick -= items[got].propability;
          //console.log(pick)
          if(pick <= 0) {
            return items[got] ? `You got **${items[got].name}** with propability ${items[got].propability}%` : "You did'nt get any items, try again...";
          }
        }
      }

      //choose random items
      return message.inlineReply(draw(), { allowedMentions: { repliedUser: false } });

      break;
    case "emoji":
      function isCustomEmoji(emoji) {
        return emoji.split(":").length == 1 ? false : true;
      }
      if (isCustomEmoji(args[1])){
      let customemoji = Discord.Util.parseEmoji(args[1]);
      let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
      if(!emojicheck) return message.inlineReply(`this emoji is invaild!`, { allowedMentions: { repliedUser: false } });
      return message.inlineReply(`[Emoji](https://cdn.discordapp.com/emojis/${emojicheck.id}.png?v=1) : ${emojicheck}`, { allowedMentions: { repliedUser: false } });}
      break;
    case "hex":
if(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(args[1])) return message.inlineReply(`Your hexcolor is ${args[1]}`, { allowedMentions: { repliedUser: false } });
      break;
    case "supreme":
      let role = await client.util.searchRole(message, args[1]);
      return message.inlineReply(role.name, { allowedMentions: { repliedUser: false } });
    case "join":
      return client.emit("guildMemberAdd", message.member);
    case "leave":
      return client.emit("guildMemberRemove", message.member);
    case "join-bot":
      return client.emit("guildCreate", message.guild);
    case "leave-bot":
      return client.emit("guildDelete", message.guild);
    case "set":
      return await client.quickdb.set("math", 25)
      .then(message.inlineReply("Successfully, setting up test data on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "add":
      return await client.quickdb.add("math", 50)
      .then(message.inlineReply("Successfully, adding 50 on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "subtract":
      return await client.quickdb.subtract("math", 50)
      .then(message.inlineReply("Successfully, subtracting 25 on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "delete":
    if(!args || args.length === 0) return;
      return await client.quickdb.delete(args.slice(1).join(" "))
      .then(message.inlineReply("Successfully, deleting test data on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "has":
      return await client.quickdb.has("math")
      .then(message.inlineReply("Test data is really existed on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "push":
      return await client.quickdb.push("math", "fun")
      .then(message.inlineReply("Pushing fun to Test data on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    case "pull":
      return await client.quickdb.pull("math", "fun")
      .then(message.inlineReply("Pulling fun to Test data on quickonline.", { allowedMentions: { repliedUser: false } }))
      .catch((e) => { client.functions.sendLogs(message, e, "error")});
    default :
        if(!(Method.length === 0)) return;
        return message.inlineReply(require("util").inspect(await client.quickdb.all(), { depth: 5 }), { allowedMentions: { repliedUser: false } });
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "testing",
  description: "Testing Commands",
  examples: [],
  usage: ["<option>", "<value>"],
  type: []
};

exports.conf = {
  aliases: ["test"],
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