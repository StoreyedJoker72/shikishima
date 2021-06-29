// This event executes when a members (users) is left.
const Discord = require("discord.js-light");

module.exports  = async (client, member) => {

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.goodbye`);
    if(!(setting)) return;
    const channel = member.guild.channels.cache.find(c => c.id === setting);
    if(!(channel)) return;
    const embed = {
        color: client.color.orange,
        author: {
            name: `${member.user.tag} (${member.id})`,
            icon_url: member.user.displayAvatarURL({ size: 4096, dynamic: true }),
        },
        footer: {
            text: "User Left",
        },
        timestamp: Date.now(),
    };

    channel.send({ embed: embed });
}