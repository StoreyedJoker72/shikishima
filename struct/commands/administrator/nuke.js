exports.run = async (client, message, Discord) => {
  try { // Put your Code below.

        const response = await client.functions.awaitReply(message, `Are you sure you want to nuke this channel?`);
        if(!response) return;

        // If they respond with y or yes, continue.
        if(!["y", "yes", "yep", "yea", "ya"].includes(response.toLowerCase())) return;
          message.channel.clone({
            name: message.channel.name,
            reason: 'Needed a delete'
          }).then(async(clone) => {
            clone.send(`https://media.giphy.com/media/iZuLdzQ5eoD1C/giphy.gif`)
            message.channel.delete();
          });
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "nuke",
  description: "Delete all message on a certain channel.",
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
  bot: ["MANAGE_CHANNELS"],
  user: ["ADMINISTRATOR"]
};