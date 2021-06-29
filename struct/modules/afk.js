const Discord = require("discord.js-light");

module.exports = (client) => {
	client.on("message", async(message) => {
		try {
			if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
			//if (!(await message.client.quickdb.get(`afk.${message.guild.id}.${message.author.id}`))) return;
			const mentioned = message.mentions.members.first();
			const memberAFK = await message.client.quickdb.get(`afk.${message.guild.id}.${message.author.id}`);
			const cache = message.guild.members.cache;
			
			const prefix = ";"
			const regex = ["((i|ill|I'll|i'll|im)( *)(gonna|gtg)( *)(sleep|slept|afk))", "((i|ill|I'll|i'll)( *)(goin|going)( *)to( *)(sleep|slept|afk))", "(gotta( *)go)", `(${prefix}afk)`, "(( *)cya( *)(gonna|goin))", "((i|ill|I'll|i'll)( *)be( *)right( *)back)"];
			const setAFK = new RegExp(regex.join("|"), "i");
			
			if(message.content.match(setAFK)) {
				const contents = message.content.replace(setAFK, "");
				const reason = contents.length > 5 ? contents : "none";
				const valueAFK = {
					"id": message.author.id,
					"username": message.author.username,
					"reason": reason,
					"time": Date.now()
				}
				await message.client.quickdb.set(`afk.${message.guild.id}.${message.author.id}`, valueAFK);
				if(message.author.id !== message.guild.ownerID) {
					if(!(message.channel.permissionsFor(message.guild.me).has(["MANAGE_NICKNAMES"]))) return;
					message.member.setNickname(`[AFK] ${message.member.nickname ? message.member.nickname.replaceAll("[AFK] ", "") : message.author.username.replaceAll("[AFK] ", "")}`);
				} message.channel.send(`${message.author.username} are now goin to AFK.`);
				return console.log("AFK Module", `${message.member.nickname ? message.member.nickname : message.author.username} are now AFK`);
			}
			
			if((memberAFK)) {
				const member = await cache.get(memberAFK.id);
				if(!(member)) return;
				await message.client.quickdb.delete(`afk.${message.guild.id}.${member.user.id}`);
				if(message.author.id !== message.guild.ownerID) {
					if(!(message.channel.permissionsFor(message.guild.me).has(["MANAGE_NICKNAMES"]))) return;
					member.setNickname(member.nickname ? member.nickname.replaceAll("[AFK] ", "") : member.user.username.replaceAll("[AFK] ", "")).then(message.channel.send(`${member.user.username} is now back!`));
				}
				return console.log("AFK Module", `${member.user.username} is now Back`);
			}
			
			if(mentioned) {
				if(!(await message.client.quickdb.get(`afk.${message.guild.id}.${mentioned.id}`))) return;
				let {
					id, reason, time
				} = await message.client.quickdb.get(`afk.${message.guild.id}.${mentioned.id}`);
				if(reason === "none") reason = ["Hey bruh, im not available right now.", "Ping me later, cuz im tired.", "Hmm, ping me later bruhh...", "Don't mention me bruh.. maybe next time :poop:"].random();
				const content = (`I'm currently AFK (${require("moment")(time).fromNow()})\n**Reason: **${reason}`);
				const member = await cache.get(id);

				return message.client.util.sendWebhook(message, content, {
					username: member.user.username,
					avatar: member.user.displayAvatarURL({
						size: 4096,
						dynamic: true
					})
				});
			}
		} catch(e) {
			console.error("AFK Module", `${e.name}: ${e.stack}`);
		}
	})
}