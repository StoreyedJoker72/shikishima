const Canvas = require("canvas");

exports.run = async (client, message, Discord, [member]) => { // eslint-disable-line no-unused-vars
  member = await client.util.searchMember(message, member, { current: true });
  if (!member) return;// message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code Here.
    const canvas = Canvas.createCanvas(500, 500);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(member.user.displayAvatarURL({size: 4096, format: "png"}));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#74037b";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    const avatar = await Canvas.loadImage("https://i.imgur.com/R4ScM9Q.png");
    ctx.drawImage(avatar, 50, -75, 500, 500);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "xmashat.png");

    return message.channel.send(attachment);
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "christmashat",
  description: "Generates your avatar wearing a christmas hat...",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["christhat", "santahat", "santify", "hatchristmas", "🎅"],
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
