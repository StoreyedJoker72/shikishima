const Discord = require("discord.js-light");

module.exports = (client) => {
    client.on('message', async (message) => {
		try {
      if(!message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
    const botinviteRegex = [
        `((${client.user.username.fixedUsername()}|<@!?${client.user.id}>)( *)(bot( *)invite|invite))`,
        `(bot( *)invite)`,
    ];

    const botinvite = new RegExp(botinviteRegex.join("|"), "i");

    if (message.content.match(botinvite)) {
    }

		} catch(e) {
			client.util.Log().error("Pretend Module", `${e.name}: ${e.stack}`);
		}
	})

}