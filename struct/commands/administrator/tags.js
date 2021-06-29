exports.run = async (client, message, Discord, [option, key, ...value]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    if(!key || key.length === 0) { key = undefined; }
    if(!value || value.length === 0) { value = undefined; }
    const Method = option ? option.toLowerCase() : "";
    switch (Method) {
      case "add":
      case "create":
      if ((await message.client.quickdb.get(`tag.${message.guild.id}.${key}`))) return message.inlineReply("`❌` This tag already exists", { allowedMentions: { repliedUser: false } });
      return message.inlineReply(`I have added the tag \`${key}\` with a reply of \`${value.join(" ")}\``, { allowedMentions: { repliedUser: true } })
      .then(async() => {
        await message.client.quickdb.set(`tag.${message.guild.id}.${key}`, value.join(" "));
      })
      case "delete":
      case "remove":
      if (!(await message.client.quickdb.get(`tag.${message.guild.id}.${key}`))) return message.inlineReply("`❌` No such tag exists!", { allowedMentions: { repliedUser: false } });
      return message.inlineReply(`I have deleted the tag \`${key}\``, { allowedMentions: { repliedUser: true } })
      .then(async() => {
        await message.client.quickdb.delete(`tag.${message.guild.id}.${key}`);
      })
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "tags",
  description: "Create custom command.",
  examples: [],
  usage: ["<action(add|delete)>", "<message>"],
  type: []
};

exports.conf = {
  aliases: ["tag", "cc", "custom-command"],
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
  user: ["ADMINISTRATOR"]
};