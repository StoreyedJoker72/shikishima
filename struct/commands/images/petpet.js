const pet = require("pet-pet-gif");

exports.run = async (client, message, Discord, args) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, args.join(" "), { current: true });
  //if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
		var Attachment = message.attachments;
		if (Attachment.array()[0]) {
			var url = Attachment.array()[0].url;
		}
		let avatar = member.user.displayAvatarURL({size: 4096, format: "png"})

		const animatedGif = await pet(args[0] || url || avatar);
		message.channel.send(new Discord.MessageAttachment(animatedGif, "pet.gif"));
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "petpet",
  description: "Generates your avatar petting...",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["pet-pet"],
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
