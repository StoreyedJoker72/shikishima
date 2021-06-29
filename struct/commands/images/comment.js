exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.


        let sentence = args.join(' ');
        sentence = sentence.replace(/ /g, "%20");
        let link = `https://some-random-api.ml/canvas/youtube-comment?avatar=https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}&comment=${sentence}&username=${message.author.username}`;
        // -------- Sending the image as an image attachment --------
        //create a message attachment with the name of the file with discord.js built in attachment class.
        let attachment = new Discord.MessageAttachment(link, 'comment.png');

        message.channel.send(attachment); //send the attachment

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "comment",
  description: "Return youtube comment image.",
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
  bot: [],
  user: []
};