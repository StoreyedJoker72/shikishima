const { Client, Intents, Collection, Constants } = require("discord.js-light"), fs = require("fs"), config = require("../storage/config");

// Load .env
require("dotenv").config();

/**
 * This wil be the Client Structure for our Bot.
 * <info>Note that all settings, mapping, etc..
 * will be found here, so make sure to understand it.</info>
 * @extends {client}
 */

//Quick Database
const { Database: replitDatabase } = require("quick.replit");
//Custom Database
const { JsonDatabase: jsonDatabase } = require("wio.db");

/**
 * @link https://github.com/NekoYasui
 * @type {'Discord.JS'|'Discord iOS'|'Discord Android'|'Discord Browser'}
 */
Constants.DefaultOptions.ws.properties.$browser = "Discord Android";

const intents = new Intents(["GUILDS", "GUILD_EMOJIS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS"]);

class Shikishima extends Client {
    /** @constructor i put an important code for the bot*/
	constructor() {
		super({

      //Important
      ws: { intents: intents },
      restTimeOffset: 0,
      disableMentions: "everyone",
      fetchAllMembers: true,
      partials: ["USER",  "MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"],
      shards: "auto",

      //Message
      messageEditHistoryMaxSize: 5000,
			messageCacheMaxSize: 5000,
      messageSweepInterval: 1800,
      messageCacheLifetime: 1800,

      //Cache
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: true,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: true
    });

		//Token, Command/Event Path
    this.setMaxListeners(0);
	this.token = process.env.DISCORD_TOKEN;
	this.cmdPath = "./struct/commands";
	this.eventPath = "./struct/events";
	this.modulePath = "./struct/modules";
	this.extendPath = "./struct/extends";

    //Collection Map
  	this.commands = new Collection();
	this.rateLimits = new Collection();
	this.aliases = new Collection();
    this.helps = new Collection();
	this.station = new Map();
    this.snipes = new Map();
    this.esnipes = new Map();
    this.yes = ["yes", "y", "ye", "yeah", "yup", "yea", "ya", "hai", "si", "sí", "oui", "はい", "correct"];
    this.no = ["cancel", "no", "n", "nah", "nope", "nop", "iie", "いいえ", "non", "fuck off"];

    //Required
	this.config = config;
  this.customdb = new jsonDatabase({ databasePath: "db.json" });
  this.quickdb = new replitDatabase();
	this.color = require("../storage/color");
	this.badwords = require("../storage/badwords");
	this.functions = require("./utilities/functions");
	this.util = require("./utilities/utils");
  let userRan = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19 ,20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 138, 175, 148, 268, 412, 212, 246, 252].random();
  let guildRan = [1, 2, 3, 4, 5, 6].random();
  this.fake = { guilds: this.guilds.cache.size + 43 + guildRan, users: this.users.cache.size + 2700 + userRan }

    //bypass reaction ratelimiting..
    this.util.removeReactionSlowdown();
	}

	async updateMuteChannelPerms(guild, memberID, permissions) {
		await guild.channels.cache.forEach((channel) => {
			channel.updateOverwrite(memberID, permissions).catch((e) => {
				this.util.Log().error("Muted User", `${e.name}: ${e.stack}`);
			});
		});
	}

	async findOrCreateMutedRole(guild) {
		return (
			guild.roles.cache.find((r) => r.name === "muted") ||
			(await guild.roles.create({
				data: {
				name: "muted",
				color: this.color.none,
				},
				reason: "Mute a user",
			}))
		);
	}

	async start() {
		this.login(this.token).catch(err => this.util.Log().error("Discord Token", "Check your token"));
		//Commands/Events/Modules Handling
		fs.readdir(`${this.cmdPath}/`, (err, categories) => {
			if(err) return this.util.Log().error("Commands Handling", err);
			//this.util.Log().log("Commands Handling", `Found total ${categories.length} categories.`);
			categories.forEach((category) => {

				let moduleConf = require(`.${this.cmdPath}/${category}/module.json`);
				if(!moduleConf) return this.util.Log().warn("Commands Handling", `Could not find module.json at .${this.cmdPath}/${category} folder`);
				moduleConf.path = `${this.cmdPath}/${category}`;
				moduleConf.cmds = [];
				this.helps.set(category, moduleConf);

				fs.readdir(`${this.cmdPath}/${category}`, (err, files) => {
					if(err) return this.util.Log().error("Commands Handling", err);
					files.forEach((file) => {
						try{
							if(!file.endsWith(".js")) return;
							let prop = require(`.${this.cmdPath}/${category}/${file}`);
							if(prop.help.name) {
								this.util.Log().success("Commands Handling", `✅ | ${prop.help.name.toProperCase()} command`);
								this.commands.set(prop.help.name, prop);
							} else {
								this.util.Log().error("Commands Handling", `❌ | ${file.toProperCase()} > missing a help.name, or help.name is not a string.`);
							}
							prop.conf.aliases.forEach((alias) => {
								this.aliases.set(alias, prop.help.name);
							});
							this.helps.get(category).cmds.push(prop.help.name);
						} catch (e) {
							return this.util.Log().error("Commands Handling", `${e.name} : ${e.stack}`);
						}
					});
				});
			});
		});

		const events = fs.readdirSync(`${this.eventPath}/`).filter(files => files.endsWith(".js"));
		if (events.length <= 0) return this.util.Log().warn("Events Handling", `Could not find any events listener at  ${modulesDir} folder`);
		for (const file of events) {
      		delete require.cache[require.resolve(`.${this.eventPath}/${file}`)];

			const Name = file.split(".")[0];
			this.util.Log().success("Events Handling", Name.toProperCase());
			const event = require(`.${this.eventPath}/${file}`);
			//this.on(file.split(".")[0], (...args) => event(this, ...args));
			this.on(file.split(".")[0], event.bind(null, this));
		}
	}
};
module.exports =  Shikishima;