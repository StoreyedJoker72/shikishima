const Discord = require("discord.js-light"),
	sourcebin = require("sourcebin");

module.exports = (client) => {
	client.on("message", async message => {
		try {
      if(!message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
      
      let setting = await message.client.quickdb.get(`settings.${message.guild.id}.sourcebin`);
      if(!(setting)) return;
			const check = new RegExp(/```(?:(\S+)\n)?\s*([^]+?)\s*```/i);
			if(!check.test(message.content)) return;
			const {
				code, lang
			} = getCodeBlock(message.content);
			const verifyReg = new RegExp(`^(js|py|html|css)( |)$`);
			if(!verifyReg.test(lang.toLowerCase())) return;
      //if(lang === "py"){let lang = "python";}
      sourcebin.create([
        {
            name: `https://bot.shikishima.ga Code Snippet from ${message.author.username}`,
            content: code,
            languageId: lang
        }
      ], {
        title: message.guild.name,
        description: `Author: ${message.author.tag}`
      }).then(async(bin) => {
      const reply = await client.functions.translate(message, `Hey there, I've automatically uploaded your code to <{{url}}> for you. When possible please consider using a source sharing service, thank you!`);
        //console.log(`Name: ${bin.url} | Raw: ${bin.files[0].raw}`);
        await message.reply(reply.replace(/{{url}}/g, bin.url));
      }).catch(console.error);
		} catch(e) {
			client.util.Log().error("Sourcebin Module", `${e.name}: ${e.stack}`);
		}
	})


	function getCodeBlock(txt) {
		const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
		if(!match) return { lang: null, code: txt };
		if(match[1] && !match[2]) return { lang: null, code: match[1] };
		return { lang: match[1], code: match[2] };
	}

}