const { runInNewContext } = require("vm");
const chalk = require("chalk");
const { inspect } = require("util");
const	sourcebin = require("sourcebin");
const PrettyError = require("pretty-error"),
pe = new PrettyError();
pe.withoutColors();
const options = {
	callback: false,
	stdout: true,
	stderr: true
};

exports.run = async (client, message, Discord, [...evaluation]) => { // eslint-disable-line no-unused-vars
  try { // Put your Code below.

if (!evaluation) return await message.channel.send(":x: You must provide code to execute!");

const script = parseCodeblock(evaluation.join(" ").replace(/(^`{3}(\w+)?|`{3}$)/g, ""));

if (!(
  await confirmation(
    message,
    new Discord.MessageEmbed()
      .setTitle("⚠️ Are you sure you would like to execute the following code:")
      .setDescription("```js\n" + script + "```")
      .setColor(client.color.none),
    {
      deleteAfterReaction: true
    }
  )
)) return;

const context = {
  client,
  message,
  evaluation,
  Discord,
  console,
  require,
  process,
  global
};

const scriptOptions = {
  filename: `${message.author.id}@${message.guild.id}`,
  timeout: 60000,
  displayErrors: true
};

let start = Date.now();
let result = execute(`"use strict"; (async () => { ${script} })()`, context, scriptOptions);
let end = Date.now();

if (((await result) && !(await result).stdout) && ((await result) && !(await result).callbackOutput) && ((await result) && !(await result).stderr)) {
  if (!(
    await confirmation(
      message,
      "`⚠️` Nothing was returned. Would you like to run the code again with implicit return?",
      {
        deleteAfterReaction: true
      }
    )
  )) return;
  else {
    start = Date.now();
    result = execute(`"use strict"; (async () => ${script} )()`, context, scriptOptions);
    end = Date.now();
  }
}

result
  .then(async (res) => {
    if (
      (options.stdout && res && res.stdout) ||
    (options.stderr && res && res.stderr) ||
    (options.callback && res && res.callbackOutput)
    ) {
      console.log(chalk`{red {strikethrough -}[ {bold Eval Output} ]{strikethrough ---------}}`);
      if (options.callback && res.callbackOutput) console.log(res.callbackOutput);

      if (options.stdout && res.stdout) {
        console.log(chalk`{red {strikethrough -}[ {bold stdout} ]{strikethrough --------------}}`);
        console.log(res.stdout);
      }
      if (options.stderr && res.stderr) {
        console.log(chalk`{red {strikethrough -}[ {bold stderr} ]{strikethrough --------------}}`);
        console.error(res.stderr);
      }
      console.log(chalk`{red {strikethrough -}[ {bold End} ]{strikethrough -----------------}}`);
    }

    if (
      res.callbackOutput && (typeof res.callbackOutput === "string" ? res.callbackOutput : inspect(res.callbackOutput, { depth: 3 })).includes(client.token) ||
      res.stdout && res.stdout.includes(client.token) ||
      res.stderr && res.stderr.includes(client.token)
    ) {
      if (!(
        await confirmation(
          message,
          "`💣` The bot token is likely located somewhere in the output of your code. \nWould you like to display the output?",
          {
            deleteAfterReaction: true
          }
        )
      )) return;
    }
    const embed = await generateEmbed(script, res, { start, end });
    const msg = await message.channel.send({ embed: embed });

    if (!(
      await confirmation(
        message,
        "`📝` Would you like to post the output of this command on sourcebin?",
        {
          deleteAfterReaction: true
        }
      )
    )) return;

    const evalOutput = [];

    if (res.callbackOutput) {
      evalOutput.push(
        "-[ Eval Output ]---------",
        typeof res.callbackOutput === "string" ? res.callbackOutput : inspect(res.callbackOutput, { depth: 3 })
      );
    }

    if (res.stdout) {
      evalOutput.push(
        "-[ stdout ]--------------",
        typeof res.stdout === "string" ? res.stdout : inspect(res.stdout, { depth: 3 })
      );
    }

    if (res.stderr) {
      evalOutput.push(
        "-[ stderr ]--------------",
        typeof res.stderr === "string" ? res.stderr : inspect(res.stderr, { depth: 3 })
      );
    }

      sourcebin.create([
        {
            name: `https://bot.shikishima.ga Evaluation Logs from ${message.author.username}`,
            content: evalOutput.join("\n"),
            languageId: "text"
        }
      ], { 
        title: message.guild.name,
        description: `Author: ${message.author.tag}`
			}).then(async(bin) => {
			const reply = await client.functions.translate(message, `Hey there, I've automatically uploaded your code to <{{url}}> for you. When possible please consider using a source sharing service, thank you!`);
				//console.log(`Name: ${bin.url} | Raw: ${bin.files[0].raw}`);
    await msg.edit({ embed: embed.addField(":notepad_spiral: SourceBin", bin.url) });
			}).catch(console.error);

  });


async function execute (code, context, options) {
	return await new Promise((resolve) => {
		try {
			captureOutput(() => runInNewContext(code, context, options))
				.then(resolve)
				.catch(resolve);
		} catch (err) {
			resolve(err);
		}
	});
}

async function generateEmbed (code, outs, { start, end }) {
	var output = typeof outs && outs.callbackOutput && outs.callbackOutput.then === "function" ? await outs && outs.callbackOutput : outs && outs.callbackOutput;
	const stdout = outs && outs.stdout;
	const stderr = outs && outs.stderr;

	const embed = new Discord.MessageEmbed()
		.setFooter(`Execution time: ${end - start}ms`)
		.setTimestamp();
	if (output) {
		embed
			.setTitle(":outbox_tray: Output:")
			.setDescription("```js\n" + ((typeof output === "string" ? output : inspect(output, { depth: 3 })) || "undefined").substring(0, 2000) + "```");
	}

	if (stdout) embed.addField(":desktop: stdout", "```js\n" + ((typeof stdout === "string" ? stdout : inspect(stdout, { depth: 3 })) || "undefined").substring(0, 1000) + "```");

	if (stderr) embed.addField("⚠️ stderr", "```js\n" + ((typeof stderr === "string" ? stderr : inspect(stderr, { depth: 3 })) || "undefined").substring(0, 1000) + "```");

	if (!embed.fields.length && !embed.description) embed.setTitle("Nothing was returned.");

	if ((stdout && !isError(outs && outs.callbackOutput)) || (stdout && !output) || (!stdout && !output && !stderr)) embed.setColor(client.color.green);
	else if (!stdout && !output && stderr) embed.setColor(client.color.yellow);
	else embed.setColor(isError(output) ? client.color.red : client.color.green);

	embed.addField(":inbox_tray: Input", "```js\n" + code.substring(0, 1000) + "```");

	return embed;
}

function isError (object) {
	const name = object && object.constructor && object.constructor.name;
	if (!name) return true;
	return /.*Error$/.test(name);
}

// Code from: https://github.com/lifeguardbot/lifeguard/blob/a31f57b5164d95d16f0dd961c10a5b77dc9e7bd4/src/plugins/dev/eval.ts#L6-L13
function parseCodeblock (script) {
	const cbr = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
	const result = cbr.exec(script);
	if (result) {
		return result[4];
	}
	return script;
}

/**
 * Ask for confirmation before proceeding
 * @param {Message} message Discord.js message object
 * @param {string} confirmationMessage Ask for confirmation
 * @param {ConfirmationOptions} [options] Options
 * @param {string} [options.confirmMessage] Edit the message upon confirmation
 * @param {string | MessageEmbed} [options.denyMessage] Edit the message upon denial
 * @param {number} options.time Timeout
 * @param {boolean} [options.keepReactions] Keep reactions after reacting
 * @param {boolean} [options.deleteAfterReaction] Delete the message after reaction (takes priority over all other messages)
 * @example
 * const confirmationMessage: string = "Are you sure you would like to stop the bot?"
 * const options = {
 *   confirmMessage: "Shutting down...",
 *   denyMessage: "Shutdown cancelled."
 * }
 *
 * const proceed = await confirmation(message, confirmationMessage, options)
 *
 * if (proceed) process.exit(0)
 */
async function confirmation (message, confirmationMessage = {}, options = {}) {
	const yesReaction = "✔️";
	const noReaction = "✖️";

	const filter = ({ emoji: { name } }, { id }) => (name === yesReaction || name === noReaction) && id === message.author.id;

	const msg = await message.channel.send(confirmationMessage);

	await msg.react(yesReaction);
  await client.util.delay(250);
	await msg.react(noReaction);

	const e = (await msg.awaitReactions(filter, { max: 1, time: options && options.time || 300000 })).first();

	if (options && options.deleteAfterReaction) msg.delete();
	else if (!options && options.keepReactions) msg.reactions.removeAll();

	if (e && e.emoji && e.emoji.name === yesReaction) {
		if (options && options.confirmMessage && !options.deleteAfterReaction) await msg.edit(options && options.confirmMessage instanceof Discord.MessageEmbed ? { embed: options && options.confirmMessage, content: null } : { embed: null, content: options && options.confirmMessage });
		return true;
	} else {
		if (options && options.denyMessage && !options.deleteAfterReaction) await msg.edit(options && options.denyMessage instanceof Discord.MessageEmbed ? { embed: options && options.denyMessage, content: null } : { embed: null, content: options && options.denyMessage });
		return false;
	}
}

/**
 * Capture stdout and stderr while executing a function
 * @param {Function} callback The callback function to execute
 * @returns {Promise<CapturedOutput>} stdout, stderr and callback outputs
 */
async function captureOutput (callback) {
	return await new Promise((resolve, reject) => {
		const oldProcess = { ...process };
		let stdout = "";
		let stderr = "";

		// overwrite stdout write function
		process.stdout.write = (str) => {
			stdout += str;
			return true;
		};

		// overwrite stderr write function
		process.stderr.write = (str) => {
			stderr += str;
			return true;
		};

		try {
			const c = callback();

			delete process.stdout.write;
			process.stdout.write = oldProcess.stdout.write;

			delete process.stderr.write;
			process.stderr.write = oldProcess.stderr.write;

			return c
				.catch((c) => reject({ stdout, stderr, callbackOutput: c })) // eslint-disable-line prefer-promise-reject-errors
				.then((callbackOutput) => resolve({ stdout, stderr, callbackOutput }));
		} catch (error) {
			delete process.stdout.write;
			process.stdout.write = oldProcess.stdout.write;

			delete process.stderr.write;
			process.stderr.write = oldProcess.stderr.write;
			return reject({ stdout, stderr, callbackOutput: error }); // eslint-disable-line prefer-promise-reject-errors
		}
	});
}
  } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "eval",
  description: "Evalutes javascript code",
  examples: [],
  usage: ["<...code>"],
  type: []
};

exports.conf = {
  aliases: [""],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: true,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  bot: [],
  user: [],
};