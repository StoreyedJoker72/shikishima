module.exports = (client) => {
  try {

    client.on("messageReactionAdd", async(reaction, user) => {
      if(reaction.message.partial) await reaction.message.fetch();
      if(reaction.partial) await reaction.fetch();
      if(!(reaction.message.guild)) return;
      if (!(reaction.message.guild.me.hasPermission("MANAGE_MESSAGES"))) return;
      if(user.bot || user.id === reaction.message.client.user.id) return;
      const member = reaction.message.guild.members.cache.get(user.id);
      if (!member) return;
      
      const settings = await await reaction.message.client.quickdb.get(`reaction.${reaction.message.guild.id}`);
      if(!(settings)) return;
      console.log(settings)
      console.log(`emoji: ${reaction.emoji.name}
      emoji db: ${require("node-emoji").emojify(settings.reaction.emoji.name)}`)
      if (reaction.message.id != settings.message || !(reaction.emoji.id === settings.reaction.emoji.id) || !(reaction.emoji.name === require("node-emoji").emojify(settings.reaction.emoji.name))) return console.log("not passed");
       console.log("passed");
      if (!(member.roles.cache.has(settings.reaction.role))) {
        member.roles.add(settings.reaction.role);
      } else {
        member.roles.remove(settings.reaction.role);
      }

      let channel = reaction.message.guild.channels.cache.get(settings.channel);
      if (!(channel)) return;
      const message = await channel.messages.fetch(settings.message);
      message.reactions.resolve(reaction.emoji.toString()).users.remove(user.id);
    })

    } catch (e) {
      client.util.Log().error("Reaction-Role Module", `${e.stack}`);
  }
}
