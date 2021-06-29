// This event executes when a new guild (server) is joined.
const Discord = require("discord.js-light");

module.exports = (client, guild) => {
    let found = 0;
    guild.channels.cache.map(async(channel) => {
        if (found === 0) {
            if (channel.type === "text") {
               if (channel.permissionsFor(client.user).has(["VIEW_CHANNEL","SEND_MESSAGES"]) === true) {
                    found = 1; //Start getting guilds

    //Send Information to main guild
    const server = client.guilds.cache.get("817240181987737613");
    if (!server) return console.log('guildCreate => line:14 - Unable to find guild.');
    const schannel = server.channels.cache.find(c => c.id === "817617710418231296" && c.type === 'text');
    if (!schannel) return console.log('guildCreate => line:16 - Unable to find channel.');
    let invite, content;
    if(guild.me.hasPermission("CREATE_INSTANT_INVITE")){
      invite = await channel.createInvite({maxAge: 0, unique: true, reason: "Joined Server."})
    }
    content = `${client.config.emojis.joined} ${client.user.username.toProperCase()} Bot joined with total of ${guild.memberCount} members.\nOwned by ${guild.owner.user.tag} (${guild.owner.id})\n${invite? `Invite link: \`${invite.url}\``: ""}`;
    client.util.sendWebhook(null, content, { guild : server, channel : schannel, username : client.util.cleanGuildName(guild.name), avatar : guild.iconURL({size: 4096, dynamic: true})});


  channel.send({embed: {
    color : client.color.none,
    author: {
        name: `${client.user.username.toProperCase()} Bot`,
        icon_url: client.user.displayAvatarURL({size: 4096, dynamic: true}),
        url: "https://bot.shikishima.ga/"
    },
    thumbnail: {
    url: guild.iconURL({size: 4096, dynamic: true})
    },
    description: `Hey there! I am **${client.user.username.toProperCase()}**, an Multi-purpose Bot for Discord\n\nTo get started, send  \`\`@shikishima help\`\` for the command list. \n\nJoin my [support server](https://discord.gg/n6EnQcQNxg)`,
    timestamp: new Date(),
    footer: {
        icon_url: client.user.displayAvatarURL({size: 4096, dynamic: true}),
        text: "Have fun using with me"
    }
  }});
                } //End of getting guilds
            }
        }
    });
};