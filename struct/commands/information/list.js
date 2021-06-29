exports.run = async (client, message, Discord, [option]) => {
  try { // Put your Code below.
    if(option === "server" || option === "servers" || option === "guilds"|| option === "guild"){
      const guilds = client.guilds.cache.array()
      const info = await client.functions.translate(message, "Server Information for");
      const generateEmbed = start => {
          const current = guilds.slice(start, start + 10)

          const embed = client.util.BaseEmbed(message)
          embed.setDescription(`${info} **${client.user.username}** (ID: ${client.user.id})`);
          // you can of course customise this embed however you want
            current.forEach(g => embed.addField(`❯ ${g.name}`,[ `• ID: ${g.id}`,`• Owner: ${g.owner.user.tag}`]))
            return embed
        }

          // edit: you can store the message author like this:
        const author = message.author

        // send the embed with the first 10 guilds
        message.channel.send(generateEmbed(0)).then(message => {
          // exit if there is only one page of guilds (no need for all of this)
          if (guilds.length <= 10) return
          // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
          message.react('➡️')
          const collector = message.createReactionCollector(
            // only collect left and right arrow reactions from the message author
            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
            // time out after a minute
            {time: 60000}
          )

          let currentIndex = 0
          collector.on('collect', reaction => {
            // remove the existing reactions
            message.reactions.removeAll().then(async () => {
              // increase/decrease index
              reaction.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10
              // edit message with new embed
              message.edit(generateEmbed(currentIndex))
              // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
              if (currentIndex !== 0) await message.react('⬅️')
              // react with right arrow if it isn't the end
              if (currentIndex + 10 < guilds.length) message.react('➡️')
            })
          })
        })
    } else

    if(option === "emojis"){
    let Emojis = "";
    let EmojisAnimated = "";
    let EmojiCount = 0;
    let Animated = 0;
    let OverallEmojis = 0;
    function Emoji(id) {
        return client.emojis.cache.get(id).toString();
    }
    message.guild.emojis.cache.forEach((emoji) => {
        OverallEmojis++;
        if (emoji.animated) {
            Animated++;
            EmojisAnimated += ` ${Emoji(emoji.id)}`;
        } else {
            EmojiCount++;
            Emojis += ` ${Emoji(emoji.id)}`;
        }
    });

      if (EmojisAnimated.length > 1024) EmojisAnimated = "Too many animated emojis to display.";
      if (!EmojisAnimated) EmojisAnimated = "No animated emojis to display"; 
      if (Emojis.length > 1024) Emojis = "Too many standard emojis to display.";
      if (!Emojis) Emojis = "No standard emojis to display"; 
      const embed = client.util.BaseEmbed(message)
      .setDescription(await client.functions.translate(message, "Emojis Information for") + ` **${message.guild.name}** (ID: ${message.guild.id})`)
        .addField("❯ " + await client.functions.translate(message, "Animated Details"), EmojisAnimated)
        .addField("❯ " + await client.functions.translate(message, "Standard Details"), Emojis)

        return message.channel.send(embed)
    } else

    if(option === "channels") {
      const channels = message.guild.channels.cache;
      const voiceChannels = channels
        .filter((channel) => channel.type === "voice")
        .map((channel) => channel.name)
        .join(", ");
      const textChannels = channels
        .filter((channel) => channel.type === "text")
        .map((channel) => `<#${channel.id}>`)
        .join(" ");

      const embed = client.util.BaseEmbed(message)
      .setDescription(await client.functions.translate(message, "Channels Information for") + ` **${message.guild.name}** (ID: ${message.guild.id})`)
        .addField("❯ " + await client.functions.translate(message, "Text Channel Details"), textChannels)
        .addField("❯ " + await client.functions.translate(message, "Voice Channel  Details"), voiceChannels)

        return message.channel.send(embed)
    } else

    if(option === "members") {
    const embed = client.util.BaseEmbed(message)
      .setDescription(await client.functions.translate(message, "Members Information for") + ` **${message.guild.name}** (ID: ${message.guild.id})`)
      .addField("❯ " + await client.functions.translate(message, "Members Details"), [
        `• Total: ${message.guild.memberCount}`, `• Members: ${message.guild.members.cache.filter((mem) => !mem.user.bot).size}`, `• Bots: ${message.guild.members.cache.filter((mem) => mem.user.bot).size}`]);

      return message.channel.send(embed)
    } else

    if(option === "roles"){

      let rolemap = message.guild.roles.cache      
      .sort((a, b) => b.position - a.position)
      .filter((role) => role.name !== "muted" && role.name !== "@everyone")
      .map(r => r)         
      .join(" ");       
      if (rolemap.length > 1024) rolemap = "To many roles to display";     
      if (!rolemap) rolemap = "No roles to display"; 

      const embed = client.util.BaseEmbed(message)
      .setDescription(await client.functions.translate(message, "Roles Information for") + ` **${message.guild.name}** (ID: ${message.guild.id})`)
      .setThumbnail(message.guild.iconURL({size: 4096, dynamic: true}))
      .addField(`❯ ` + await client.functions.translate(message, "Roles Details"), [
        rolemap]);


      return message.channel.send(embed)
    } else {
            const embed = client.util.BaseEmbed(message)
            .setColor(client.color.orange)
            .setTitle(await client.functions.translate(message, "Wrong Arguments"))
            .setDescription(await client.functions.translate(message, `Type \`${message.client.user.username} help list\` for the usages/examples`))
            return message.channel.send(embed)
      }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "list",
  description: "Get a list of (Servers|Channels|Members)",
  examples: ["list servers", "list channels", "list members"],
  usage: ["<option(servers|channels||roles|emojis)>"],
  type: []
};

exports.conf = {
  aliases: [],
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