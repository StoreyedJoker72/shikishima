module.exports = (client) => {
    const isInvite = async (guild, code) => {
      return await new Promise((resolve) => {
        guild.fetchInvites().then((invites) => {
          for (const invite of invites) {
            if (code === invite[0]) {
              resolve(true)
              return
            }
          }
  
          resolve(false)
        })
      })
    }
  
    client.on('message', async (message) => {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;

      let setting = await message.client.quickdb.get(`settings.${message.guild.id}.anti-invite`);
      if(!(setting)) return;
      const { guild, content } = message;
      const DiscordExpression = new RegExp(/(discord\.(gg|io|me|li)|discordapp\.com\/invite)/i);
      const invite = content.split(DiscordExpression)[3];
      const code = invite.replace(/ ?\//g, "");
      if (DiscordExpression.test(content)) {
        const isOurInvite = await isInvite(guild, code)
        if (!isOurInvite) {
          await message.delete();
          await message.reply("you are not allowed to send external invite links here.")
        }
      }
    })
  }