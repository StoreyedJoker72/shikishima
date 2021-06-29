// This event executes when a members (users) is joined.
const Discord = require("discord.js-light");

module.exports  = async (client, member) => {

    let setting = await message.client.quickdb.get(`channels.${message.guild.id}.welcome`);
    if(!(setting)) return;
    const channel = member.guild.channels.cache.find(c => c.id === setting);
    if(!(channel)) return;
    const embed = {
        color: client.color.green,
        author: {
            name: `${member.user.tag} (${member.id})`,
            icon_url: member.user.displayAvatarURL({ size: 4096, dynamic: true }),
        },
        footer: {
            text: "User Joined",
        },
        timestamp: Date.now(),
    };

    channel.send({ embed: embed });
}