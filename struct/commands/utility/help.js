exports.run = async (client, message, Discord, [command]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    // If the user type the [command], also with the aliases.
    const embed = client.util.BaseEmbed(message);
    if (command) {
      let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
      if(!cmd) return;
      embed.setTitle(cmd.help.name.toProperCase());
      embed.addField("❯ " + await client.functions.translate(message, "Description"), await client.functions.translate(message, cmd.help.description));
      if (cmd.help.usage && cmd.help.usage.length > 0){
        const usage = cmd.help.usage.map((usage) => `${usage}`).join(" ");
        embed.addField("❯ " + await client.functions.translate(message, "Usage"), `\`\`\`${usage}\`\`\`` );
      }
      if (cmd.conf.aliases && cmd.conf.aliases.length > 0){
        const alias = cmd.conf.aliases.map((alias) => `${alias}`).join(", ");
        embed.addField("❯ " + await client.functions.translate(message, "Aliases"), `\`\`\`${alias}\`\`\``);
      }
      if (cmd.help.examples && cmd.help.examples.length > 0){
        const examples = cmd.help.examples.map((example) => `${message.client.user.username} ${cmd.help.name.toLowerCase()} ${example}`).join("\n");
        embed.addField("❯ " + await client.functions.translate(message, "Examples"), `\`\`\`${examples}\`\`\``);
      }
    } else {
      //banner
      embed.setImage([
        "https://i.imgur.com/f1axWFK.gif",
        "https://i.imgur.com/t2Sa9Hi.gif",
        "https://i.imgur.com/0h5OZub.gif",
        "https://i.imgur.com/5xwPtCm.gif",
        "https://i.imgur.com/1pnNwu6.gif",
        "https://i.imgur.com/wk3Fw5h.gif"].random());
      // This will hide a folder from display that includes "hide: true" in their module.json
      var categories = client.helps.array();
      let serverPrefix = await message.client.quickdb.get(`settings.${message.guild.id}.prefix`);
      embed.setAuthor(`${client.user.username} ` + await client.functions.translate(message, `Bot`),client.user.displayAvatarURL());
      embed.setDescription(await client.functions.translate(message, "For additional info on a command, use") + ` \`${serverPrefix ? serverPrefix : `@${message.client.user.username.toLowerCase()}`} help <command>\``);
      if(!client.config.ownerID.includes(message.author.id)) categories = client.helps.array().filter((x) => !x.hide);
      for (const category of categories) {
        if(category.name.toLowerCase() === "music"){
        /**embed.addField(`❯ ` + await client.functions.translate(message, `${category.name}`), 
        require("common-tags").stripIndents(`
        \`\` The prefix for music command is " ; " \`\`

        \`apply-filter\` \`bassboost\` \`clean\` \`clear-queue\` \`filters\` \`join\` \`leave\` \`loop\`
        \`lyrics\` \`nightcore\` \`nowplaying\` \`pause\` \`play\` \`queue\` \`resume\` \`search\` \`shuffle\` \`skip\`
        \`song-information\` \`stop\` \`volume\` \`ping-music\` \`uptime-music\` | \`radio\`
        `));*/
        } else
        if(category.name.toLowerCase() === "emojis"){
        /**embed.addField(`❯ ` + await client.functions.translate(message, `${category.name}`), 
        require("common-tags").stripIndents(`
        \`\` Offline - means u can't use this emoji. \`\`

        \`emoji-baka\` \`emoji-cuddle\` \`emoji-feed\` \`emoji-foxgirl\` \`emoji-gecg\` \`emoji-goose\` \`emoji-holo\`  \`emoji-hug\` \`emoji-kemonomimi\` \`emoji-kiss\` \`emoji-lizard\` \`emoji-meow\` \`emoji-neko\` \`emoji-nekogif\` \`emoji-poke\` \`ravatar\` \`rwallpaper\` \`emoji-slap\` \`emoji-smug\` \`emoji-tickle\` \`emoji-waifu\` \`emoji-woof\`
        `));*/
        } else 
        if(category.name.toLowerCase() === "giveaway"){
        //embed.addField(`❯ ` + await client.functions.translate(message, `${category.name} `), 
        //require("common-tags").stripIndents(`\`end\` \`giveaway\` \`reroll\``));
        } else 
        if(category.name.toLowerCase() === "nsfw"){
          
        /**embed.addField(`❯ ` + await client.functions.translate(message, `${category.name}`), 
        require("common-tags").stripIndents(`\`anal\` \`bj\` \`boobs\` \`classic\` \`cumsluts\` \`ero\` \`erofeet\` \`erokemonomimi\` \`erokitsune\` \`eroneko\` \`feet\` \`femdom\` \`futanari\` \`gasm\` \`hentai\` \`kuni\` \`lesbian\` \`pussy\` \`spank\` \`tits\` \`trap\` \`yuri\`
        `));*/
        } else {
        embed.addField(`❯ \`${category.reaction}\` ` + await client.functions.translate(message, `${category.name}`), category.cmds.map((c) => `\`${c}\``).join(" "));
        }
      }
    }

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "help",
  description: "Display a list of all available commands!",
  examples: ["ping"],
  usage: ["<command>"],
  type: []
};

exports.conf = {
  aliases: ["h"],
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
  user: [],
};