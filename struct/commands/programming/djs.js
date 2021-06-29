const fetch = require("node-fetch"),
srcRegex = RegExp(/\s?--src=([a-zA-Z-]+)/);

exports.run = async (client, message, Discord, [...docs]) => {
  try { // Put your Code below.

    let searchString = docs.join(" ");
    if (!searchString) searchString = await client.functions.awaitReply(message, `What do you want to search for?`);
    if (!searchString) return;
    const project = srcRegex.test(searchString) ? srcRegex.exec(searchString)[1] : "stable";
    const query = srcRegex.test(searchString) ? searchString.replace(RegExp(`\\s?--src=${project}`), "") : searchString;
    const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${project}&q=${encodeURIComponent(query)}`).catch(() => null);
    if (res.status === 404) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    const embed = await res.json();

    message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "docs",
  description: "Search [discord](https://www.npmjs.com/package/discord.js) api documentation.",
  examples: ["docs Client",
             "docs Message",
             "docs ClientUser#setActivity --src=master"],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["djs"],
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