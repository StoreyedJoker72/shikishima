const Discord = require("discord.js-light");

module.exports = (client) => {
  try{
    const regexs = [
        "(can( *)(I|we)( *)get( *)a(n?)( *)F)",
        "(F( *)(to( *)pay)|for( *)respect(s?))",
        "(F( *)please)"
    ];
    const re = new RegExp(regexs.join("|"), "i");

    const Big_F = [
      "(can( *)(i|I|we)( *)get( *)(a|the)( *)biggest( *)F)",
      "(can( *)(i|I|we)( *)get( *)(a|the)( *)(big|huge|fat|thicc)( *)F)",
      "(a( *)moment( *)of( *)silence( *)for( *)our( *)fallen( *)comrade(s?))"
    ];
    const re2 = new RegExp(Big_F.join("|"), "i");

    const honk = [
      "(^y$)",
      "(((\s|\n)+)y(((\s|\n)+)|$))",
      "(can( *)(I|we)( *)get( *)a( *)Y)",
      "(can( *)(I|we)( *)get( *)a( *)honk)",
      "(Milady, might thou grace us with a HONK of great import\?)"
    ];
    const re3 = new RegExp(honk.join("|"), "i");

    client.on("message", message => {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
      if (re2.test(message.content)) {
          message.reply("\nFFFFFF\nFF\nFFFFF\nFF\nFF");
      }
      else if (re.test(message.content)) {
          message.reply("F");
      }

      if (re3.test(message.content)) {
         // message.reply("honk");
      }
    });
  } catch(e) {
    client.util.Log().error("GiveF Module", "there is a problem occured while running the module.");
  }
}