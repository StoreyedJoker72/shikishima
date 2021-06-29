
const Discord = require("discord.js-light");

module.exports = async (client) => {
		try {
      // Stores the current count.
      let count = 0
      // Stores the timeout used to make the bot count if nobody else counts for a set period of
      // time.
      let timeout;

      client.on('message', async (message) => {
        let setting = await client.quickdb.get(`channels.${message.guild.id}.counting`);
        if(!(setting)) return;
        // Only do this for the counting channel of course
        // If you want to simply make this work for all channels called 'counting', you
        // could use this line:
        // if (client.channels.cache.filter(c => c.name === 'counting').keyArray().includes(message.channel.id))
        if (message.channel.id === setting) {
          // You can ignore all bot messages like this
          if (message.member.user.bot) return;
          // If the message is the current count + 1...
          if (Number(message.content) === count + 1) {
            // ...increase the count
            count++
            // Remove any existing timeout to count
            if (timeout) client.clearTimeout(timeout);
            // Add a new timeout
            timeout = client.setTimeout(
              // This will make the bot count and log all errors
              () => message.channel.send(++count).catch(console.error),
              // after 30 seconds
              30000
            );
          // If the message wasn't sent by the bot...
          } else if (message.member.id !== client.user.id) {
            // ...send a message because the person stuffed up the counting (and log all errors)
            message.channel.send(`${message.member} messed up!`).catch((e) => client.util.Log().error("Counting Module", `${e.name}: ${e.stack}`));
            // Reset the count
            count = 0;
            // Reset any existing timeout because the bot has counted so it doesn't need to
            // count again
            if (timeout) client.clearTimeout(timeout);
          }
        }
      })
		} catch(e) {
			client.util.Log().error("Counting Module", `${e.name}: ${e.stack}`);
		}
}