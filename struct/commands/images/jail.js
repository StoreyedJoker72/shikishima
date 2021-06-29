const canvacord = require("canvacord");

exports.run = async (client, message, Discord, args) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, args.join(" "), { current: true });
  //if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
		let avatar = member.user.displayAvatarURL({size: 4096, format: "png"})

		function grayscale() {
			if (args[0] == "true" || args[0] == "false") {
				return true;
			} else {
				return false;
			}
		}

		const animatedGif = await canvacord.Canvas.jail(avatar, grayscale());
		message.channel.send(new Discord.MessageAttachment(animatedGif, `${member.user.username}_jail.png`));
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "jail",
  description: "Put your avatar in jail",
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
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  client: [],
  user: [],
};
