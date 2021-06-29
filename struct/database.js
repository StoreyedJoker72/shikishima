this.getSettings = async(guild) => {
	try {
		const defaultSettings = {
			"prefix": {
				"enabled": "true",
				"value": this.config.bot.prefix
			},
			"messagedelete": {
				"enabled": "false",
				"value": "Update this to auto delete message meber who used bot commands"
			},
			"verify": {
				"enabled": "false",
				"value": "Update this role",
			},
			"antiswear": {
				"enabled": "false",
				"value": "Update this to detect members who used badwords.",
			},
			"antiinvitelink": {
				"enabled": "false",
				"value": "Update this to detect if member send server invite link from other server.",
			}
		}
		if(!(this.quickdb.has(`settings.default`))) this.quickdb.set(`settings.default`, defaultSettings);
		if(!guild) return await this.quickdb.get(`settings.default`);
		if(!(this.quickdb.has(`settings.${guild.id}`))) this.quickdb.set(`settings.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`settings.${guild.id}`) || {};
		return({...(await this.quickdb.get(`settings.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getSettings", `${e.name}:${e.stack}`);
	}
}
this.getChannels = async(guild) => {
	try {
		const defaultChannels = {
			"channels": {
				"log": {
					"channel": "Update this channel",
					"enabled": "false"
				},
				"moderation": {
					"channel": "Update this channel",
					"enabled": "false"
				},
				"welcome": {
					"channel": "Update this channel",
					"enabled": "false"
				},
				"goodbye": {
					"channel": "Update this channel",
					"enabled": "false"
				},
				"autovc": {
					"channel": "Update this channel",
					"enabled": "false"
				},
				"chatbot": {
					"channel": "Update this channel",
					"enabled": "false"
				}
			}
		}
		if(!(this.quickdb.has(`channels.default`))) this.quickdb.set(`channels.default`, defaultChannels);
		if(!guild) return await this.quickdb.get(`channels.default`);
		if(!(this.quickdb.has(`channels.${guild.id}`))) this.quickdb.set(`channels.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`channels.${guild.id}`) || {};
		return({...(await this.quickdb.get(`channels.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getChannels", `${e.name}:${e.stack}`);
	}
}
this.getAfk = async(guild) => {
	try {
		const defaultAfk = {
			"userid": {
				"id": "12345",
				"username": "username",
				"reason": "not specified"
			}
		}
		if(!(this.quickdb.has(`afk.default`))) this.quickdb.set(`afk.default`, defaultAfk);
		if(!guild) return await this.quickdb.get(`afk.default`);
		if(!(this.quickdb.has(`afk.${guild.id}`))) this.quickdb.set(`afk.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`afk.${guild.id}`) || {};
		return({...(await this.quickdb.get(`afk.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getAfk", `${e.name}:${e.stack}`);
	}
};
this.getTags = async(guild) => {
	try {
		const defaultTags = {
			"botinvite": {
				"id": "788971178555211787",
				"author": "Nekoyasui (788971178555211787)",
				"created": "December 15th 2020, 3:58:59 pm",
				"title": "Bot Invite",
				"color": "#36393f",
				"content": `You can invite me to your server using the \`Click Me\` Button \n\n [Click Me](https://bot.shikishima.ga/)`,
				"embed": "true"
			}
		}
		if(!(this.quickdb.has(`tags.default`))) this.quickdb.set(`tags.default`, defaultTags);
		if(!guild) return await this.quickdb.get(`tags.default`);
		if(!(this.quickdb.has(`tags.${guild.id}`))) this.quickdb.set(`tags.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`tags.${guild.id}`) || {};
		return({...(await this.quickdb.get(`tags.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getTags", `${e.name}:${e.stack}`);
	}
}
this.getLangs = async(guild) => {
	try {
		const defaultLangs = {
			"788971178555211787": {
				"id": "en",
				"name": "english",
				"user": "788971178555211787"
			}
		}
		if(!(this.quickdb.has(`languages.default`))) this.quickdb.set(`languages.default`, defaultLangs);
		if(!guild) return await this.quickdb.get(`languages.default`);
		if(!(this.quickdb.has(`languages.${guild.id}`))) this.quickdb.set(`languages.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`languages.${guild.id}`) || {};
		return({...(await this.quickdb.get(`languages.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getLangs", `${e.name}:${e.stack}`);
	}
};
this.getReactroles = async(guild) => {
	try {
		const defaultReaction = {
			"channelid": {
				"channel": "Update this channelID",
				"message": "Update this messageID",
				"roles": "Update this roles"
			}
		}
		if(!(this.quickdb.has(`reaction.default`))) this.quickdb.set(`reaction.default`, defaultReaction);
		if(!guild) return await this.quickdb.get(`reaction.default`);
		if(!(this.quickdb.has(`reaction.${guild.id}`))) this.quickdb.set(`reaction.${guild.id}`, {});
		let guildConf = await this.quickdb.get(`reaction.${guild.id}`) || {};
		return({...(await this.quickdb.get(`reaction.default`)), ...guildConf });
	}
	catch(e) {
		this.util.Log().error("getReactroles", `${e.name}:${e.stack}`);
	}
}
