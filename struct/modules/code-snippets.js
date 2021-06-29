const Discord = require("discord.js-light");

module.exports = (client) => {
  try{
    client.on("message", async message => {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;

      let setting = await message.client.quickdb.get(`channels.${message.guild.id}.code-snippet`);
      if(!(setting)) return;
        let channel = await client.util.searchChannel(message, setting);

        if(channel) {
          if(!(channel.id === message.channel.id)) return;
            if(message.channel.permissionsFor(message.client.user).has(['VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])){
                if(message.channel.permissionsFor(message.client.user).has(['USE_EXTERNAL_EMOJIS'])) {
                    message.react(client.config.emojis.upvote);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    message.react(client.config.emojis.downvote);
                } else {
                    message.react("👍");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    message.react("👎");
                }
            }
        }
    });
  } catch(e) {
    client.util.Log().error("Code-Snippets Module", "there is a problem occured while running the module.");
  }
}