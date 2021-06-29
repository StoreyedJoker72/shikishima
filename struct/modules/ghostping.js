
const Discord = require("discord.js-light"),
ghostPing = new Discord.Collection(),
ping = `||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||`,
time = 10000;

module.exports = (client) => {
    try {
     client.on("message", async (message) => {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
        if(message.content.includes(ping)){
        //await message.delete();
         return message.inlineReply([
            "Why you used that secret technique ping method ...", 
            "Don't use this sacred method to ping someone bruh!?", 
            "R u God? stop using this sacred ping method.", 
            "wooh, woooooh... did you just used this the *ultime sacred forbidden technique Ghost Ping method*!?"
          ].random(), { allowedMentions: { repliedUser: false } });
        }

         if(!message.mentions.members.first()) return;
         if (message.mentions.members.first().id === message.author.id) return;
         ghostPing.set(`pinged:${message.mentions.members.first().id}`, Date.now() + time);

         setTimeout(() =>{
            ghostPing.delete(`pinged:${message.mentions.members.first().id}`);
         }, time)
     });
     client.on("messageDelete", async (message) => {
       if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
        if(!message.mentions.members.first())return;
         if(ghostPing){
         return message.reply([
            "why you used that ping method bruh...", 
            "Stop, ghost pinging..", 
            "R u stupid? stop ghost pinging...", 
            "please, please stop Ghost Pinging someone..."
          ].random());
         }
     });
    } catch(e){
        client.util.Log().error("Ghostping Module", "there is a problem occured while running the module.");
    }
}