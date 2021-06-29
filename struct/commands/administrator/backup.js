const backup = require("discord-backup");
 backup.setStorageFolder(process.cwd() + "/backups/");
 
exports.run = async (client, message, Discord, [key, ...value]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below. 
  
    if(!value || value.length === 0) { value = undefined; }
    const Method = key ? key.toLowerCase() : "";
    switch (Method) {
      case "add":
      case "create":
        let create = await backup.create(message.guild, {
          maxMessagesPerChannel: 25,
          saveImages: "base64",
          jsonSave: true,
          jsonBeautify: true
        });
        if(!create) return message.inlineReply("`❌` There was an error, please check that the bot has an administrator!", { allowedMentions: { repliedUser: false } });
        message.inlineReply(`Backup created! Here is your ID: ${create.id}!\nUse \`\`${message.client.user.username} backup load ${create.id}\`\` to load the backup on another server!`, { allowedMentions: { repliedUser: true } })
      break;
      case "load":
        backup.fetch(value.join(" ")).then(async() => {
          let confirmation = await client.functions.awaitReply(message, `All the server channels, roles, and settings will be cleared. Do you want to continue?`);
          if(!confirmation.includesOf(client.yes)) return;
          backup.load(value.join(" "), message.guild, {
            clearGuildBeforeRestore: true
          }).then(() => {
            return message.author.send("The backup was successfully loaded!");
          }).catch((err) => {
            if(err === 'No backup found') return message.inlineReply(`\`❌\` ID: \`\`${value.join(" ")}\`\` has no backup available.`, { allowedMentions: { repliedUser: false } });
            else return message.author.send(`\`❌\` An error occurred: ${(typeof err === "string") ? err : JSON.stringify(err)}`);
          });
        })
      break;
      case "info":
      case "information":
        backup.fetch(value.join(" ")).then((info) => {
            const date = new Date(info.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            const embed = client.util.BaseEmbed(message)
                .setAuthor("Backup Informations")
                // Display the backup ID
                .addField("❯ ID", info.id, false)
                // Displays the server from which this backup comes
                .addField("❯ Server ID", info.data.guildID, false)
                // Display the size (in mb) of the backup
                .addField("❯ Size", `${info.size} kb`, false)
                // Display when the backup was created
                .addField("❯ Created at", formatedDate, false)
            message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
        }).catch((err) => {
            // if the backup wasn't found
            return message.inlineReply(`\`❌\` ID: \`\`${value.join(" ")}\`\` has no backup available.`, { allowedMentions: { repliedUser: false } });
        });

    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "backup",
  description: "Backup your server setting (channels|roles|emojis|messages).",
  examples: [],
  usage: ["<action(create|load|info)>", "<value>"],
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
  user: ["ADMINISTRATOR "]
};