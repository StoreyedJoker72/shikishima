const Discord = require("discord.js-light");

module.exports = (client) => {
    client.on("message", async message => {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;

      let setting = await message.client.quickdb.get(`settings.${message.guild.id}.swear`);
      if(!(setting)) return;
        try {
            if (client.badwords.some((bad) => message.content.match(bad))) {
                await message.delete();
                const content = ["Sorry, i forgot that i'm a man of God.", "Excuse me for saying a Badwords.", "Holy Molly, i'm sorry saying a Badwords.", "I Swear in the name of God, i will not gonna say it again.", "Profanity is not good to communicating someone, sorry guyz.", "Sorry, for using badwords, I'm a good Christian."].random();
                const member = await client.util.searchMember(message, message.author.id);
                if(!member) return;
                if(!(message.guild.me.permissionsIn(message.channel).has("MANAGE_WEBHOOKS"))) return message.inlineReply([
                  "You are not allowed to say badwords", 
                  "Are you a stupid, stop using badwords", 
                  "Don't be a shithole, be matured bruh.", 
                  "Are you a special child? why your using badwords, be matured bruh.", 
                  "You're not a child anymore, so be matured.. Saying badwords is not cool bruh."
                  ].random(), { allowedMentions: { repliedUser: false } });
                return client.util.sendWebhook(message, content, { username : member.user.username, avatar : member.user.displayAvatarURL({size: 4096, dynamic: true })});
            }
        } catch (e) {
            client.util.Log().error("Badwords Module", "I could'nt find some Badwords Arrays.");
        }
    })
}
