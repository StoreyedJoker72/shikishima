const ms = require("ms");

exports.run = async (client, message, Discord, [channel, time]) => {
  try { // Put your Code below.

    if (!channel) channel = await client.functions.awaitReply(message, `Where would you like to start the slow mode?`);
    if (!channel) return;

    channel = await client.util.searchChannel(message, channel, { current: true });
    if (!channel) return message.inlineReply("`❌` That channel cannot be found on this server.", { allowedMentions: { repliedUser: false } });

    if (!time) time = await client.functions.awaitReply(message, `Please enter the slow mode duration! [>= ${client.util.msToTime(ms("6h"))}]`);
    if (!time) return;
    
    const type = phrase => {
      // !phrase would be triggered with 0, so we check if it is undefined or not.
      if (phrase === undefined || !phrase.length) return undefined;

      // Parse the input phrase to time format.
      if (ms(phrase) === 0 || ms(phrase) > 1000) return ms(phrase);

      // This will store the final parsed time.
      let parsedTime = 0;
      // Split the input time by spaces.
      const words = phrase.split(' ');
      for (const word of words) {
        if (ms(word) === 0 || ms(word) > 1000) parsedTime += ms(word);
        else return undefined;
      }
      return parsedTime;
    }
    time = type(time);
		return await channel.setRateLimitPerUser(time/1000).then(() => message.inlineReply(`\`🍇\` ${time ? `Slow mode has been set in ${channel} for ${client.util.msToTime(time)}` : `Slow mode has been cleared in ${channel}`}.`)).catch((e) => client.functions.sendLogs(message, e, "error"));

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "slowmode",
  description: 'Assigns a nickname to a member! Use "clear" or leave it blank to remove the nickname!',
  examples: ["#channel 5m"],
  usage: ["<#channel>", "<time>"],
  type: []
};

exports.conf = {
  aliases: ["nick"],
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
  user: ["MANAGE_CHANNELS"]
};