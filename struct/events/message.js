// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

const Discord = require("discord.js-light");

module.exports = async(client, message) => {

    if(!message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
    if (message.partial) await message.fetch();
    if (message.channel.partial) await message.channel.fetch();
    if (message.author.partial) await message.author.fetch();
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);
    if (!message.channel.permissionsFor(message.guild.me).has(["SEND_MESSAGES"])) return;

    message.owner = await message.guild.members.fetch(message.guild.owner.id).catch("There is a problem occured while fetching the guild owner");
    client.guildID = message.guild.id;
    client.channelID = message.channel.id;
    let bot = await client.util.searchMember(message, client.config.bot.id, { current: true });
    let serverPrefix = await message.client.quickdb.get(`settings.${message.guild.id}.prefix`);
    const PrefixRegex = new RegExp(`^(${serverPrefix ?`${serverPrefix}|`: ""}<@!?${bot.user.id}>|${bot.user.username.toLowerCase().fixedUsername()}|${bot.displayName.toLowerCase().fixedUsername()}|<@!?${message.author.id}> cmd|${message.author.username.fixedUsername()} cmd)`, "i", "(\s+)?");
    let usedPrefix = message.content.toLowerCase().match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];

    //Arguments
    let args, commandName;
    if(!usedPrefix) {
      if(!(message.mentions.users.first().id === client.user.id)) return;
      args = message.content.trim().split(/ +/g);
      commandName = args.shift().toLowerCase();
    } else {
      args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
      commandName = args.shift().toLowerCase();
    }
    //console.log(`arguments:  ${args}\ncommandss: ${commandName}`)
    if(!commandName.length) return;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
    }
    //Custom Commands
    if (!client.commands.has(commandName) && !client.commands.has(client.aliases.get(commandName))) {
        let tag = message.content.slice(usedPrefix.length);
        if (!(await message.client.quickdb.get(`tag.${message.guild.id}.${tag}`))) return;
        try {
          return message.channel.send(await message.client.quickdb.get(`tag.${message.guild.id}.${tag}`))
        } catch (e) { // End of the Code.
            client.functions.sendLogs(message, e, "error");
        } finally {
          client.util.Log().log("Tags Used", `(${message.author.id}) ran a command: ${commandName}`);
        }

    } else {
      let command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
      //Check if command exist

        //Check Bot Basic Permission to Access Guild Server
        if (client.config.bot.requirements && client.config.bot.requirements.length > 0 && !message.channel.permissionsFor(message.guild.me).has(client.config.bot.requirements !== "" ? client.config.bot.requirements : "SEND_MESSAGES")) {
            const permissions = `${message.channel.permissionsFor(message.guild.me).missing(client.config.bot.requirements).join(", ").replace(/_/gi, " ")}`;
            const embed = client.util.BaseEmbed(message)
                .setTitle(`${client.user.username} Permission in ${client.util.cleanGuildName(message.guild.name)}`)
                .setColor(client.color.orange)
                .setDescription(`\`📛\` Before to proceed, configure this missing permission first.`)
                .addField("Permission:", [
                  `\`\`\`${permissions}\`\`\``,
                  `**Link: [${client.util.cleanGuildName(message.guild.name)}](https://discord.com/channels/${message.guild.id}/${message.channel.id} "Configure the missing permission")**`
                ]);

            return message.author.send(embed);
        }

        if(command.help.name){
            message.author.pendingResponse = false
        } else { message.author.pendingResponse = true }
        if(message.channel.permissionsFor(message.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])){
          if (message.author.pendingResponse) { return message.react('🚫'); } else { message.react('🆗'); }
        }
        //Check Guild Only use commands
        if (command.requirements.guildOnly && command.requirements.guildOnly === true && !message.guild && message.channel.type === "dm") {
            const embed = client.util.BaseEmbed(message)
                .setColor(client.color.orange)
                .setDescription(`\`⚠️\` This command cannot be executed on DM channel.`);

            return client.util.sendWebhook(message, embed);
        }

        //Check Owner Permission
        if (command.requirements.owner && command.requirements.owner === true && !client.config.ownerID.includes(message.author.id)) {
            const embed = client.util.BaseEmbed(message)
                .setTitle("Developer Command")
                .setColor(client.color.orange)
                .setDescription(`\`♨️\` Sorry, this command can only be used by the developer of the bot.`);

            return client.util.sendWebhook(message, embed);
        }


        //Check Bot Permission
        if (command.requirements.bot && command.requirements.bot.length > 0 && !message.channel.permissionsFor(message.guild.me).has(command.requirements.bot !== "" ? command.requirements.bot : "SEND_MESSAGES")) {
            const permissions = `${message.channel.permissionsFor(message.guild.me).missing(command.requirements.bot).join(", ").replace(/_/gi, " ")}`;
            const embed = client.util.BaseEmbed(message)
                .setTitle(`${client.user.username} Permission`)
                .setColor(client.color.orange)
                .setDescription(`\`📛\` I don't have Permission to use this Command.`)
                .addField("Permission:", `\`\`\`${permissions}\`\`\``);

            return client.util.sendWebhook(message, embed);
        }

        //Check Users Permission
        if ( command.requirements.user && command.requirements.user.length > 0 && !message.member.hasPermission(command.requirements.user !== "" ? command.requirements.user : "SEND_MESSAGES")) {
            let check = await message.client.functions.permissionsFor(message, { permission: command.requirements.user });
            if(!(check)) return;
        }

        //Check Required Arguments
        if (command.requirements.usage && command.requirements.usage === true) {
            let check = await message.client.functions.argsFor(message, { args: args, usages: command.help.usage, examples: command.help.examples });
            if(!(check)) return;
        }

        //Check NSWF Channel
        if (command.requirements.nsfwOnly && command.requirements.nsfwOnly === true && !message.channel.nsfw) {
            const embed = client.util.BaseEmbed(message)
                .setColor(client.color.orange)
                .setDescription(`\`🔞\` This channel is not a NSFW channel.`)

            return client.util.sendWebhook(message, embed);
        }

        //Run command
        if (!command) return;

        // Check cooldown.
        if (!client.rateLimits.has(command.help.name)) {
            client.rateLimits.set(command.help.name, new Discord.Collection());
        }

        const now = Date.now();
        const rateLimits = client.rateLimits.get(command.help.name);
        const cooldown = (command.conf.cooldown || 3) * 1000;
        if (rateLimits.has(message.author.id)) {
            const expirationTime = rateLimits.get(message.author.id) + cooldown;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const embed = client.util.BaseEmbed(message)
                .setColor(client.color.orange)
                .setTitle("Woah! Why the hurry?")
                .setDescription(`You can run this command again in **${timeLeft.toFixed(1)} seconds** before using the \`${message.client.user.username} ${commandName}\``);
                return client.util.sendWebhook(message, embed);
            }
        }

        rateLimits.set(message.author.id, now);
        setTimeout(() => rateLimits.delete(message.author.id), cooldown);

        try {
          command.run(client, message, Discord, args);
        } catch (e) { // End of the Code.
            client.util.Log().error("Command Executing", `${e.name}:${e.stack} `);
        } finally {
          client.util.Log().log("Command Used", `(${message.author.id}) ran a command: ${commandName}`);
        }
    }
};