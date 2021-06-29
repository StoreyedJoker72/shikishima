const Discord = require("discord.js-light"), request = require("node-superfetch"),
 { createCanvas, loadImage } = require("canvas"),
 { stripIndents } = require("common-tags");
module.exports = (client) => {
    client.on("message", async (message) => {
		try {
      if(!message.guild || !message.author || !message.content || message.author.bot || message.author.id === client.user.id) return;
    
    /**const guessReg = [
        `(what( *)anime( *)is( *)this)`,
        `(anyone( *)kno)`,
    ];
    const guess = new RegExp(guessReg.join("|"), "i");*/

    if (message.content.includesAll(["what","anime","is"])) {
        let screenshot;
        let image = new RegExp(/(http(|s):.*\.(jpg|png|jpeg|gif))/i);
        if (image.test(message.content)) {
          screenshot = message.content.split(image)[1];
        } else
        if(message.attachments.first()) {
            screenshot = message.attachments.first().url;
        } else
        if(message.mentions.users.first()) {
            screenshot = message.mentions.users.first().displayAvatarURL({size: 4096, format: "png" });
        } else {
           screenshot = null; 
        }
        if(!screenshot) return console.log("Please upload a image or mention a user!");
		try {
            message.channel.startTyping()
			const status = await fetchRateLimit();
			if (!status.status) {
        console.log(status)
        message.channel.stopTyping()
        //if(!status.refresh) return message.inlineReply(`Sorry, I can't guess what the title of the anime is.`, { allowedMentions: { repliedUser: false } });
				//return message.inlineReply(`Oh no, I"m out of requests! Please wait ${status.refresh? status.refresh : "5"} seconds and try again.`, { allowedMentions: { repliedUser: false } });
			}
			let { body } = await request.get(screenshot);
			if (screenshot.endsWith(".gif")) body = await convertGIF(body);
			const result = await search(body, message.channel.nsfw);
			if (result === "size") return message.inlineReply("Please do not send an image larger than 10MB.", { allowedMentions: { repliedUser: false } });
			if (result.nsfw && !message.channel.nsfw) {
				return message.inlineReply("This is from a hentai, and this isn\"t an NSFW channel, pervert.", { allowedMentions: { repliedUser: false } });
			}
			const title = `${result.title}${result.episode ? ` episode ${result.episode}` : ""}`;
             message.channel.stopTyping()
			return message.reply(stripIndents`
				I"m ${result.prob}% sure this is from ${title}.
				${result.prob < 87 ? "_This probablity is rather low, try using a higher quality image._" : ""}
			`, result.preview ? { files: [{ attachment: result.preview, name: "preview.mp4" }] } : {});
		} catch (e) {
      await message.channel.stopTyping(true);
      client.functions.sendLogs(message, e, "error");
		}
    }
	function base64(text, mode = "encode") {
		if (mode === "encode") return Buffer.from(text).toString("base64");
		if (mode === "decode") return Buffer.from(text, "base64").toString("utf8") || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
	}
	async function fetchRateLimit() {
		try {
			const { body } = await request.get("https://trace.moe/api/me");
			return { status: body.quota > 0, refresh: body.quota_ttl };
		} catch {
			return { status: false, refresh: Infinity };
		}
	}

	async function search(file) {
		if (Buffer.byteLength(file) > 1e+7) return "size";
		const { body } = await request
			.post("https://trace.moe/api/search")
			.attach("image", base64(file));
		const data = body.docs[0];
    console.log(data)
		return {
			prob: Math.round(data.similarity * 100),
			episode: data.episode,
			title: data.title_english,
			preview: await fetchPreview(data),
			nsfw: data.is_adult
		};
	}

	 async function fetchPreview(data) {
		try {
			const { body } = await request
				.get(`https://media.trace.moe/video/${data.anilist_id}/${encodeURIComponent(data.filename)}`)
				.query({
					t: data.at,
					token: data.tokenthumb
				});
			return body;
		} catch {
			return null;
		}
	}

	 async function convertGIF(image) {
		const data = await loadImage(image);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(data, 0, 0);
		return canvas.toBuffer();
	}
		} catch(e) {
			client.util.Log().error("Guess Anime Module", `${e.name}: ${e.stack}`);
		}
	})

}