const fetch = require("node-fetch");

exports.run = async (client, message, Discord, [repo]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if (!repo) repo = await client.functions.awaitReply(message, `What repository am i supposed to show you?`);
    if (!repo) return;

    const [username, repository] = repo.split("/");
    if(username && !repository){ //return message.inlineReply(await client.functions.translate(message, "Repository be in the form `username/repository`"), { allowedMentions: { repliedUser: false } });
      await fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json()).then(async(body) => {
          if(body.message) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
        const embed = client.util.BaseEmbed(message)
        .setTitle(`${body.login} (${body.id})`)
        .setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
        .setURL(body.html_url)
        .setThumbnail(body.avatar_url)
        .setDescription(body.bio || "No Bio.")
        .addField("❯ " + await client.functions.translate(message, "ID"), `${body.id}`, true)
        .addField("❯ " + await client.functions.translate(message, "Name"), `${body.login}`, true)
        .addField("❯ " + await client.functions.translate(message, "Location"), body.location || "No Location", true)
        .addField("❯ " + await client.functions.translate(message, "Repositories"), body.public_repos, true)
        .addField("❯ " + await client.functions.translate(message, "Followers"), `${body.followers}`, true)
        .addField("❯ " + await client.functions.translate(message, "Following"), body.following, true)
        .addField("❯ " + await client.functions.translate(message, "Account Created"), moment.utc(body.created_at).format("dddd, MMMM, Do YYYY (h:mm:ss)"));
        
        message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
        }) 
        return;
    }

    const res = await fetch(`https://api.github.com/repos/${username}/${repository}`).catch(() => null);
    if (res.status === 404) return message.inlineReply(await client.functions.translate(message, "No search results found, maybe try searching for something that exists."), { allowedMentions: { repliedUser: false } });
    const body = await res.json();

    const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
    const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";

    const embed = client.util.BaseEmbed(message)
    .setTitle(body.full_name)
		.setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
    .setURL(body.html_url)
    .setThumbnail(body.owner.avatar_url)
    .setDescription(body.description || "No Description.")
    .addField("❯ " + await client.functions.translate(message, "Language"), body.language, true)
    .addField("❯ " + await client.functions.translate(message, "Forked"), body.forks_count.toLocaleString(), true)
    .addField("❯ " + await client.functions.translate(message, "License"), license, true)
    //.addField("❯ " + await client.functions.translate(message, "Watchers"), body.subscribers_count.toLocaleString(), true)
    .addField("❯ " + await client.functions.translate(message, "Stars"), body.stargazers_count.toLocaleString(), true)
    .addField("❯ " + await client.functions.translate(message, " Size"), size, true)
    .addField("❯ " + await client.functions.translate(message, "Open Issues"), body.open_issues.toLocaleString(), true);
    if(body.fork) embed.addField("❯ " + await client.functions.translate(message, "Forked"), `[${body.parent.full_name}](${body.parent.html_url})`, true);
    if(body.archived) embed.addField("❯ " + await client.functions.translate(message, "This repository is Archived"), "\u200b", true);

    return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "github",
  description: "View a GitHub repository details.",
  examples: ["NekoYasui/Discord-Template"],
  usage: ["<username/repo>"],
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