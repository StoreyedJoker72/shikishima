const fetch = require("node-fetch"),
axios = require('axios');

let memeCreationInfo = {};

// Function to make call to meme API
async function apiCalls(subreddit = '') {
	// Make API call to get random meme from reddit
	// .data to only return the data (response)
	try {
		const memeLink = (await axios({
			url: "https://meme-api.herokuapp.com/gimme" + `/${subreddit}`,
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		}));

		console.log('Call to Meme API: Successful');
		return memeLink.data;
	} catch (error) {
		console.log('Call to Meme API: Failure');
		// Log the API error and return the data
		console.log(error.response);
		return error.response.data;
	}

}

async function memeCreation(message) {
	// Create a filter where the responses author has to be the same as the once who started the command
	const filter = m => m.author.id === message.author.id;

	// Go through each question, catch an error (thrown or timeout)
	try {
		await questionImage(message, filter);
    await client.util.delay(500);
		await questionTop(message, filter);
    await client.util.delay(500);
		await questionBottom(message, filter);
	} catch (error) {
		// If error is UserException, ask them to retry
		if (error instanceof UserException) {
			await retryCommand(message, error.message, error.position);
		// Else it's timeout error, can't ask to retry here
		} else {
			console.log('Call to Meme Creator API: Failure');
			console.log(error);
			message.inlineReply('No response given. Command timed out.', { allowedMentions: { repliedUser: false } });
			// Since global variable, reset it at the end
			memeCreationInfo = {};
		}
	}

	// If not keys in memeCreationInfo object, exit command
	if(!Object.keys(memeCreationInfo).length) return;
	console.log('Call to Meme Creator API: Successful');
	// Return the formatted url (API is stateless, this is how the call is done)
	return `https://api.memegen.link/images/custom/${memeCreationInfo.topText}/${memeCreationInfo.bottomText}.png?background=${memeCreationInfo.url}`;

}

async function questionImage(message, filter) {
	// Create await message, waiting 2 minutes for 1 message from the author
	let img = await client.functions.awaitImage(message, `Upload the image template that you want to create a meme.`);
	// Check the msg collection to see if there is an attachment in the attachment collection
	if(img) {
		// Set the url in object to the attachment url
		memeCreationInfo.url = img;
	} else {
		// Throw exception if not found
      return message.inlineReply('`👍` Command cancelled.', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
	}
}

async function questionTop(message, filter) {
	// Create await message, waiting 2 minutes for 1 message from the author
	let msg = await client.functions.awaitReply(message, `What will be the top text of your meme? For no bottom text type \'blank\'`);
	// Check if the message is n/a, so the user wants it blank
	if(msg && msg.toLowerCase() === "blank") {
		// Set top text to be blank
		memeCreationInfo.topText = '_';
	// Check if the message is c, so the user wants to cancel
	} else if(!msg || msg.toLowerCase() === client.no) {
		// Throw exception saying command cancelled
			return message.inlineReply('`👍` Command cancelled.', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
	// Else what remains would be the top text
	} else {
		// Filter the text so the API reads it properly
		const filteredText = filterText(msg);
		// Set top text to the filteredText
		memeCreationInfo.topText = filteredText;
	}
}

async function questionBottom(message, filter) {
	// Create await message, waiting 2 minutes for 1 message from the author
	let msg =  await client.functions.awaitReply(message, `What will be the bottom text of your meme? For no bottom text type \'blank\'`);
	// Check if the message is n/a, so the user wants it blank
	if(msg && msg.toLowerCase() === "blank") {
		// Set bottom text to be blank
		memeCreationInfo.bottomText = '_';
	// Check if the message is c, so the user wants to cancel
	} else if(!msg || msg.toLowerCase() === client.no) {
		// Throw exception saying command cancelled
			return message.inlineReply('`👍` Command cancelled.', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
	// Else what remains would be the top text
	} else {
		// Filter the text so the API reads it properly
		const filteredText = filterText(msg);
		// Set top text to the filteredText
		memeCreationInfo.bottomText = filteredText;
	}
}

function filterText(text) {
	// Given a text, split it into an array using the seperator
	// Then join it back into a string with the join item inbetween each element
	// This is a crude way to replacAll(thing to replace, thing to replace with)
	let filteredText = text.split('_').join('__');
	filteredText = filteredText.split(' ').join('_');
	filteredText = filteredText.split('?').join('~q');
	filteredText = filteredText.split('%').join('~p');
	filteredText = filteredText.split('#').join('~h');
	filteredText = filteredText.split('/').join('~s');
	filteredText = filteredText.split('"').join('\'\'');
	filteredText = filteredText.split('-').join('--');

	return filteredText;
}

// Function to let user retry if there was a validation error
async function retryCommand(message, errMsg, position) {
	// Create a filter where the responses author has to be the same as the once who started the command

	try {
		// Create await message, waiting 2 minutes for 1 message from the author
		let msg2 =  await client.functions.awaitReply(message, errMsg + ` __Retry? (Y/N)__`);
		// This was the best way I found to do it :(
		// If they want to retry use position to put in correct question
    console.log(msg2)
		if (msg2 && msg2.toLowerCase() === "y") {
    await client.util.delay(500);
			if(position === 1) {
				await questionImage(message, filter);
        await client.util.delay(250);
				await questionTop(message, filter);
        await client.util.delay(250);
				await questionBottom(message, filter);
			}
		// If they don't want to continue, cancel command & clear/reset memeCreationInfo
	} else if(!msg2 || msg2 && msg2.toLowerCase() === "n") {
			message.inlineReply('`👍` Command cancelled.', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
		// If they give any other response, cancel command & clear/reset memeCreationInfo
		// Can't ask them to retry here
		} else {
			message.inlineReply('Incorrect Response. Command Cancelled', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
		}
	} catch (err) {
		// If error is UserException go back to retry message
		if (err instanceof UserException) {
			await retryCommand(message, err.message, err.position);
		// If timeout after retry is called, the else gets called. No way to ask them to retry here.
		} else {
			message.inlineReply('No response given. Command timed out.', { allowedMentions: { repliedUser: false } });
			memeCreationInfo = {};
		}
	}
}

// Exception function takes message and position
// Message = Error message to display
// Position = Which question it happened in
function UserException(errMsg, position) {
	this.message = errMsg;
	this.position = position;
	this.name = 'UserException';
}

exports.run = async (client, message, Discord, args) => {
  try { // Put your Code below.

		if(args.length === 1 && args[0].toLowerCase() === 'create') {
			const url = await memeCreation(message);
      console.log(url)
			if(!url) return;
			message.inlineReply('Creating...'), { allowedMentions: { repliedUser: false } };

			return message.channel.send("", {
        embed: {
          description: "Here's your meme!",
          image: {
            url: "attachment://meme.png"
            }
        },
				files: [{
					attachment: url,
					name: 'meme.png',
				}],
			});
		}

		// If channel isn't memes channel return error message
		// Remove to allow memes in any channel
		//if(message.channel.name !== 'memes') return message.inlineReply('This command can only be used in memes channel');
		if((args.length >= 1 && args[0].toLowerCase() !== 'create')) {
			const subreddit = args.join(' ');
			const response = await apiCalls(subreddit);

			if (response.code) return message.inlineReply('This subreddit does not exist, is typed incorrectly, or has no images.', { allowedMentions: { repliedUser: false } });

      let image = response.url, title;
        if(response.over_18) { title = `__**NSFW**__`} else
        if(response.spoiler) { title = `__**SPOILER**__`} else { title = " " }
      if(image.endsWith(".gifv")) image = image.replace(".gifv", ".gif");
      const embed = new Discord.MessageEmbed()
        .setColor(client.color.none)
        .setURL(response.postLink)
        .setDescription(response.title)
        .setImage(image)
        .setFooter(`👍 ${response.ups || 0}`)
      if(response.over_18 || response.spoiler) embed.setTitle(title);

			return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });

			/**return message.inlineReply((response.nsfw || response.spoiler) ? `__**NSFW or SPOILER**__ \n${response.title}` : `${response.title}`, {
				files: [{
					attachment: `${response.url}`,
					name: (response.nsfw || response.spoiler) ? 'SPOILER_IMG.jpg' : 'meme.png',
				}],
			});*/
		} else {
        const rads = [
            "memes",
            "dankmemes",
            "comedyheaven",
            "Animemes"
        ].random();
        const res = await fetch(`https://www.reddit.com/r/${rads}/random/.json`);
        const json = await res.json();
        if (!json[0]) return message.inlineReply(`Your life Lmfao`, { allowedMentions: { repliedUser: false } });
        const data = json[0].data.children[0].data;
        let image = data.url, title;
        if(data.over_18) { title = `__**NSFW**__`} else
        if(data.spoiler) { title = `__**SPOILER**__`} else { title = " " }
      if(image.endsWith(".gifv")) image = image.replace(".gifv", ".gif");
      const embed = new Discord.MessageEmbed()
        .setColor(client.color.none)
        .setURL(`https://reddit.com${data.permalink}`)
        .setDescription(data.title)
        .setImage(image)
        .setFooter(`👍 ${data.ups || 0} 👎 ${data.downs || 0} 💬 ${data.num_comments || 0}`)

      if(data.over_18 || data.spoiler) embed.setTitle(title);
			return message.inlineReply({ embed: embed, allowedMentions: { repliedUser: false } });
  }
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "meme",
  description: "Get a meme from Reddit",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["s"],
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