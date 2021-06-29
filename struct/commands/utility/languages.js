exports.run = async (client, message, Discord, [option, key]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if(!key || key.length === 0) { key = undefined; }
    const Method = option ? option.toLowerCase() : "";
    switch (Method) {
      case "set":
      case "change":
      case "edit":
        return await change(message, { lang: key });
      case "help":
        return help(message);
      default:
        if(!(Method.length === 0)) return;
        return list(message);
    }

    async function change(message, { lang = undefined } = {}){
      if (!lang) lang = await client.functions.awaitReply(message, `What language you want to set? ex: \`en\` → English , \`ja\` → Japanese, etc...`);
      if (!lang) return;

      const support = ["en", "tl", "ja", "fr", "es", "pt", "zh", "ko", "ceb", "id", "th", "tk"];
      function checkAvailability(array, check) {
        return array.some(arrayValue => check === arrayValue);
      }
      if(!checkAvailability(support, lang.toLowerCase())) return message.inlineReply("That languages is not supported, maybe try something that really supported.", { allowedMentions: { repliedUser: false } });

      let check = client.config.languages.default[lang];
      if(!check) return;

      const valueLanguages = {
        "id": check.id,
        "name": check.name,
        "user": message.author.id
      }

      return message.inlineReply(`Bot Language successfully changed to **${check.name}**`, { allowedMentions: { repliedUser: false } })
      .then(async() => {
        await message.client.quickdb.set(`languages.${message.guild.id}.${message.author.id}`, valueLanguages);
      });
    }

    function list(message){

      const embed = client.util.BaseEmbed(message)
      .setTitle("Available Languages")
      .setColor(client.color.yellow)
      .setDescription(`Type \`${message.client.user.username} language help\` for the usage.`);

      for (let language of Object.keys(client.config.languages.default)) {
        const lang = client.config.languages.default[language];
        embed.addField("\u200b", `\`\`${lang.id}\`\` → **${lang.name.toProperCase()}**`);
      }

      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    }

    async function help(message){

      const help = {
        title: "Languages Configuration | Help",
        description: "If you dont how to configure, follow the usage/example.",
        usage: "language change <key>",
        examples: ["language change ja"]
      }

      const embed = client.util.BaseEmbed(message);
      embed.setTitle(`${help.title.toProperCase()}`);
      embed.setDescription(help.description);
      if (help.usage.length)
      embed.addField(
        "❯ Usage",
        `\`\`\`${help.usage}\`\`\``
      );
      if (help.examples.length){
      const example = help.examples.map((example) => `${message.client.user.username} ${example}`).join("\n")
      embed.addField(
        "❯ Examples", `\`\`\`${example}\`\`\``
      );
      }

      return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "language",
  description: "Setting up your language.",
  examples: [],
  usage: ["<option(change|help)>", "<key>"],
  type: []
};

exports.conf = {
  aliases: ["lang"],
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