const ImageRegex = /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/gi;
const LinkRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

exports.run = async (client, message, Discord, args) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

    const Method = args[0] ? args[0].toLowerCase() : "";
    switch (Method) {
    case "word":
    case "words":
        return words(message, args.slice(1));
    case "user":
    case "member":
        return users(message, args.slice(1));
    case "type":
    case "types":
        return execute(message, args.slice(1));
    default :
        return message.inlineReply('`❌` You entered an invalid option.', { allowedMentions: { repliedUser: false } });
    }

    async function words (message, [inc, amount]) {
      if (!inc) inc = await client.functions.awaitReply(message, `Provide me a word or phrase to prune!`);
      if (!inc) return;

      if (!amount) amount = await client.functions.awaitReply(message, `How many messages you want to delete? Max: 99`);
      if (!amount) return;
      const prune = parseInt(amount) + 1;

      if (isNaN(prune)) {
        return message.channel.send(await client.functions.translate(message, "`❌` That doesn't seem to be a valid number."), { allowedMentions: { repliedUser: false } });
      } else if (prune <= 1 || prune > 100) {
        return message.channel.send(await client.functions.translate(message, "`❌` You need to input a number between 1 and 99."), { allowedMentions: { repliedUser: false } });
      }

      try {
        const messages = await message.channel.messages.fetch({
          limit: Math.min(prune, 100),
          before: message.id,
        });
        const flushable = messages.filter(m => m.content.toLowerCase().includes(inc));
        if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no messages containing the word **${inc}** in the last ${prune} messages!`);
        await message.channel.bulkDelete(flushable);
        console.log(flushable.content)
        const m =  await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned ${flushable.size} ${flushable.size == 1 ? `message containing the word **${inc}**!` : `messages containing the word **${inc}**!`}`);

        return null;
      }
      catch (err) {
        console.log(err);
        return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });
      }
    }

    async function users (message, [member, amount]) {
      if (!member) member = await client.functions.awaitReply(message, `Whose member that you want to delete messages?`);
      if (!member) return;

      member = await client.util.searchMember(message, member, { current: true });
      if (!member) return message.channel.send("`❌` That member cannot be found on this server.", { allowedMentions: { repliedUser: false } });
      
      if (!amount) amount = await client.functions.awaitReply(message, `How many messages you want to delete? Max: 99`);
      if (!amount) return;
      const prune = parseInt(amount) + 1;

      if (isNaN(prune)) {
        return message.channel.send(await client.functions.translate(message, "`❌` That doesn't seem to be a valid number.", { allowedMentions: { repliedUser: false } }));
      } else if (prune <= 1 || prune > 100) {
        return message.channel.send(await client.functions.translate(message, "`❌` You need to input a number between 1 and 99.", { allowedMentions: { repliedUser: false } }));
      }

      try {
        const messages = await message.channel.messages.fetch({
          limit: prune,
          before: message.id,
        });
        const flushable = messages.filter(m => m.author.id == member.user.id);
        if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, **${member.user.username}** did not send any messages in the last ${amount} messages!`);

        await message.channel.bulkDelete(flushable);
        const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned ${flushable.size} ${flushable.size == 1 ? `message from **${member.user.username}**!` : `messages from **${member.user.username}**!`}`);

        return null;

      }
      catch (err) {
        console.log(err);
        return message.channel.send('\`❌\` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });
      }
    }

    async function execute (message, [type, amount]) {
      if (!type) type = await client.functions.awaitReply(message, `Provide me a valid type of message to prune!`);
      if (!type) return;

      if (!amount) amount = await client.functions.awaitReply(message, `How many messages you want to delete? Max: 99`);
      if (!amount) return;
      const prune = parseInt(amount);

      if (isNaN(prune)) {
        return message.channel.send(await client.functions.translate(message, "`❌` That doesn't seem to be a valid number.", { allowedMentions: { repliedUser: false } }));
      } else if (prune <= 1 || prune > 100) {
        return message.channel.send(await client.functions.translate(message, "`❌` You need to input a number between 1 and 99.", { allowedMentions: { repliedUser: false } }));
      }

      if (type == 'all') {
        try {
          const messages = await message.channel.messages.fetch({ limit: prune });
          await message.channel.bulkDelete(messages.size, true);
          return await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned ${messages.size} ${messages.size == 1 ? 'message!' : 'messages!'}`);

        }
        catch (err) {
          console.log(err);
          return await message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else

      if (type == 'images' || type == 'pics' || type == 'image') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });

          const attachments = messages.filter(m => ImageRegex.test(m.content));
          const urls = messages.filter(m => m.attachments.size > 0);

          const flushable = attachments.concat(urls);

          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no images to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);

          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'image!' : 'images!'}`);

          return null;
        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }

      } else 

      if (type == 'bots' || type == 'bot') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => m.author.bot);
          await message.channel.bulkDelete(flushable);
          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no bot messages to prune in the last ${prune} messages!`);

          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'bot message!' : 'bot messages!'}`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else 

      if (type == 'codeblocks' || type == 'code') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => m.content.startsWith('```'));

          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no codeblocks to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);
          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'codeblock!' : 'codeblocks!'}`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else

      if (type == 'attachments' || type == 'attachment' || type == 'files' || type == 'file') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => m.attachments.length > 0);
          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no attachments to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);
          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'attachment!' : 'attachments!'}`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else

      if (type == 'embeds' || type == 'embed') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => m.embeds.length > 0);
          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no embeds to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);
          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'embed!' : 'embeds!'}`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else

      if (type == 'me') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => m.id == message.author.id);
          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no messages from you to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);
          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** of your messages!`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else

      if (type == 'link' || type == 'links') {
        try {
          const messages = await message.channel.messages.fetch({
            limit: prune,
            before: message.id,
          });
          const flushable = messages.filter(m => LinkRegex.test(m.content));
          if (flushable.size == 0) return message.channel.send(`\`🍇\` **${message.author.username}**, there were no links to prune in the last ${prune} messages!`);

          await message.channel.bulkDelete(flushable);
          const m = await message.channel.send(`\`🍇\` **${message.author.username}**, successfully pruned **${flushable.size}** ${flushable.size == 1 ? 'link!' : 'links!'}`);

          return null;

        }
        catch (err) {
          console.log(err);
          return message.inlineReply('`❌` These messages are too old to be deleted! I can only delete messages within two weeks!', { allowedMentions: { repliedUser: false } });

        }
      } else {
        return message.inlineReply('`❌` You entered an invalid type of message.', { allowedMentions: { repliedUser: false } });
      }
    }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "clean",
  description: "clean up to 99 messages.",
  examples: ["clean word hello 10", "clean user @Nekoyasui 10", "clean type [all/images/links/bots/codeblocks/attachments/embeds/me] 10"],
  usage: [
    "<option(user|word|type)>", 
    "<key(@member|[word/phrase]|[all/images/links/bots/codeblocks/attachments/embeds/me])>", 
    "<amount>"
    ],
  type: []
};

exports.conf = {
  aliases: ["clear", "purge", "prune"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: ["READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
  user: ["READ_MESSAGE_HISTORY"]
};