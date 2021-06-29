exports.run = async (client, message, Discord, [...value]) => { // eslint-disable-line no-unused-vars
  let member = await client.util.searchMember(message, value.join(" "), { current: true });

  if(!member && value[0].match(/\d{16,22}$/gi)) {
    try {
          let user = await client.util.searchUser(message, value.join(" "));
          let fetch = require("node-fetch");
          let image;
          image = await fetch(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=4096`).catch(() => null);
          if(!(image.status === 200)) image = await fetch(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`).catch(() => null);
          let avatar = image ? image.url : 
            user.discriminator.endsWith(`0`) || user.discriminator.endsWith(`5`) ? `https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png` : user.discriminator.endsWith(`1`) || user.discriminator.endsWith(`6`) ? `https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png` : user.discriminator.endsWith(`2`) || user.discriminator.endsWith(`7`) ? `https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png` : user.discriminator.endsWith(`3`) || user.discriminator.endsWith(`8`) ? `https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png` : user.discriminator.endsWith(`4`) || user.discriminator.endsWith(`9`) ? `https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png` : `Not Available`;

                const embed = client.util.BaseEmbed(message)
                .setAuthor("Download Link  ⬇️", avatar, avatar)
                .setImage(avatar);

                return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
        } catch (e) {
          const embed = client.util.BaseEmbed(message)
          .setDescription(`**User not found, here's why.**
            • A user ID was not provided, get a user ID by going to\n \`User Settings -> Appearance (scroll down) -> Developer Mode (ON)\` \nAnd right click on someone, then press "Copy ID".
            • Your user ID was invalid, and could be a role, or channel ID.
            • Your ID leads nowhere.`);

          return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } })
        }
      }
  if (!member) return message.inlineReply("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
  try { // Put your Code below. 
  if(member.user.id === client.user.id) return message.inlineReply(`\`\`\`
⠄⠠⠶⠿⠟⠛⠚⠛⠛⠛⠛⠉⠉⠉⠉⠉⠉⠉⠉⠉⠛⠛⠛⠛⠛⠿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣯⣄⡀⠄⠄⢀⠈⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠉⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣇⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠛⠿⢿⣿⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⢀⣤⣶⣶⣶⣶⣶⣶⣶⣶⣶⣤⣤⣀⣀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣤⣤⣄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡿⠟⠛⠛⠛⠻⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⢉⣍⠋⢿⣿⣿⣿⣿⣷⣶⣤⠄⠄⠄⠄⠄⠄⠄
⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠗⣥⣴⡇⠄⠄⠛⢲⣬⣿⣿⣿⣿⣿⣿⣯⠄⢀⠉⣿⣷⣜⣿⣿⣿⣿⣿⡿⢻⡟⣷⡄⠄⠄⠄⠄
⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣝⣿⣧⡤⢿⢧⣸⣿⣿⣿⣿⣿⣿⣿⣿⣼⣿⣖⣿⣿⣾⣿⣿⣿⣿⣿⠁⢸⠇⠘⣷⠄⠄⠄⠄
⠄⠄⠄⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⡸⠄⠄⢸⠄⠄⠄⠄
⠄⠄⠂⠁⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠁⠄⠄⠈⠄⠄⠄⠄
⠄⠄⠄⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠄⠄⠄⢠⠄⣀⣠⣤
⠄⠄⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣧⣴⣶⣾⠿⠿⠛⠉
⠄⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣶⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⠏⠄⠄⠄⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣥⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⢟⣿⣾⣿⣿⣿⣿⣿⣿⠈⠹⣿⣿⣿⣿⣆⠄⠄⠄⠄⠄
⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⢹⢻⣿⣻⣿⣿⣿⣾⣽⣿⣟⣻⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⢻⣿⣿⣿⣿⡄⠄⠄⠄⠄
⢀⣾⣿⣿⣿⣿⢟⣯⣿⣿⣿⣿⣿⣿⣿⢚⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠄⢸⣿⣿⣿⢿⣿⠄⠄⠄⠄
⣿⣿⣿⣿⣿⣭⣽⣿⣿⣿⣿⣿⣿⣿⣿⡾⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⢹⣿⣿⣿⣿⣿⣿⣤⣿⣿⣿⡏⣸⣿⠄⠄⠄⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣋⣀⣼⠟⠁⠄⠄⠄⠄
⣿⠿⣿⣿⣿⣿⣷⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⢟⢿⣿⣻⣿⣿⣾⣿⣷⣿⣿⡟⠛⠛⠁⠄⠄⠄⠄⠄⠄
⠃⠄⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣷⣿⣿⣿⣿⣿⡷⣿⣿⢸⣿⣿⣿⣿⣸⣿⣿⣿⡿⠄⠄⠄⠄⢠⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣝⣿⣿⣿⣻⣧⢿⣷⣿⣿⣿⣿⣿⣻⡿⣾⣿⣷⣿⡿⣾⣿⣿⣿⣇⠄⠄⠄⢀⣾⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠈⠻⢿⣿⣿⣿⣿⣿⣯⣟⣷⣻⣿⣿⣿⣿⣿⣿⢿⡿⣿⡿⢭⣽⣿⡿⣿⡿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣻⣿⡿⣿⣿⣫⣾⢿⣿⣿⣯⣿⡏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠄⠄⠄⠄⠄⠄
\`\`\`
`);
      const avatar = member.user.displayAvatarURL({size: 4096, dynamic: true})
      const embed = client.util.BaseEmbed(message)
			.setAuthor("Download Link  ⬇️", avatar, avatar)
      .setImage(avatar);

      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "avatar",
  description: "Get users avatar",
  examples: ["avatar @Nekoyasui"],
  usage: ["<@member>"],
  type: []
};

exports.conf = {
  aliases: ["pfp", "av"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: [],
  user: []
};