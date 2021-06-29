const fetch = require("node-fetch");

exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.

    const body = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(args.join(" "))}`)
      .then(res => res.json().catch(() => {}));

    if (!body || !body[1].length) return message.channel.send(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."));

    const embed = client.util.BaseEmbed(message)
    .setDescription(await client.functions.translate(message, "List of **Google** Auto Fill results"))
    .addField("❯ " + await client.functions.translate(message, "Auto Fill Details"), [body[1].join("\n")])
    message.channel.send({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "autofill",
  description: "Sends a list of Google Autofill results.",
  examples: [],
  usage: ["<query>"],
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