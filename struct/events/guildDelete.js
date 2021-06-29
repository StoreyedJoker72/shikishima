// This event executes when a new guild (server) is left.
const Discord = require("discord.js-light");

module.exports = async(client, guild) => {
	if(!guild.available) return;
	client.util.Log().log("Guild Leave", `${guild.name} (${guild.id}) removed the bot.`);
	if(client.settings.has(guild.id)) {
		client.settings.delete(guild.id);
	}

  //Send Information to main guild
  const server = client.guilds.cache.get("817240181987737613");
  if (!server) return console.log('guildDelete => line:13 - Unable to find guild.');
  const schannel = server.channels.cache.find(c => c.id === "817617710418231296" && c.type === 'text');
  if (!schannel) return console.log('guildDelete => line:15 - Unable to find channel.');
  let invite, content;
  //invite = await schannel.createInvite({maxAge: 0, unique: true, reason: "Joined Server."});
  content = `${client.config.emojis.leaved} ${client.user.username.toProperCase()} Bot leaved with total of ${guild.memberCount} members.\nOwned by ${guild.owner.user.tag} (${guild.owner.id})\n${invite? `Invite link: \`${invite.url}\``: ""}`
  client.util.sendWebhook(null, content, { guild : server, channel : schannel, username : client.util.cleanGuildName(guild.name), avatar : guild.iconURL({size: 4096, dynamic: true})});

};