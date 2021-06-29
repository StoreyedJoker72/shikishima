// Modules
const Discord = require("discord.js"),
crypto = require("crypto"),
moment = require("moment"),
chalk = require("chalk"),
fs = require("fs"),
color = require("../../storage/color"),
config = require("../../storage/config");
require("moment-duration-format");

const yes = ["yes", "y", "ye", "yeah", "yup", "yea", "ya", "hai", "si", "sí", "oui", "はい", "correct"];
const no = ["no", "n", "nah", "nope", "nop", "iie", "いいえ", "non", "fuck off"];
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;
const isStringNumbers = string => [...string].every(c => '0123456789'.includes(c));
/**
 * Defined Property
 */
Object.defineProperty(String.prototype, "toProperCase", {
	value: function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	}
});

Object.defineProperty(String.prototype, "toCapitalFirstCase", {
	value: function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + text.slice(1));
	}
});

String.prototype.replaceAll = function(Old, New, Ignore) {
    return this.replace(new RegExp(Old.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"), (Ignore?"gi":"g")), (typeof(New)=="string") ? New.replace(/\$/g,"$$$$") : New);
}

Object.defineProperty(Object.prototype, "nows", {
	value: function() {
		return moment().format("h:mm A");
	}
});

Object.defineProperty(Object.prototype, "datenow", {
	value: function() {
		return moment().format("MMMM Do YYYY");
	}
});

Object.defineProperty(Object.prototype, "fullDate", {
	value: function() {
		return moment().format("MMMM Do YYYY, h:mm:ss A");
	}
});

Object.defineProperty(Array.prototype, "random", {
value: function() {
	//return this.splice(Math.floor(Math.random() * this.length), 1);
	return this[Math.floor(Math.random() * this.length)];
}
});

String.prototype.includesOf = function(arrays) {
  if(!Array.isArray(arrays)) {
    throw new Error('includesOf only accepts an array')
  }
  return arrays.some(str => this.toLowerCase().includes(str))
}

String.prototype.includesAll = function(arrays) {
  if(!Array.isArray(arrays)) {
    throw new Error('includesAll only accepts an array')
  }
  return arrays.every(str => this.toLowerCase().includes(str))
}

String.prototype.format = function (values) {

    var regex = /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g;

    var getValue = function (key) {
            if (values == null || typeof values === 'undefined') return null;

            var value = values[key];
            var type = typeof value;

            return type === 'string' || type === 'number' ? value : null;
        };

    return this.replace(regex, function (match) {
        //match will look like {sample-match}
        //key will be 'sample-match';
        var key = match.substr(1, match.length - 2);

        var value = getValue(key);

        return value != null ? value : match;
    });
};

Object.defineProperty(String.prototype, "clean", {
	value: function() {
		return this.replace(/`/g, "'" + String.fromCharCode(8203));
	}
});

Object.defineProperty(String.prototype, "formatNumber", {
	value: function() {
		return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
});

Object.defineProperty(Object.prototype, "colorRan", {
	value: function() {
		let colorRan = ["#e05151", "#e8ab51", "#517ce0", "#51e066", "#6ee6de", "#e66e90", "#edd572", "#d26de8", "#dedede", "#1c1c1c", "#36393f"].random();
		return colorRan;
	}
});

Object.defineProperty(String.prototype, "capitalFirst", {
	value: function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
});

Object.defineProperty(String.prototype, "fixedUsername", {
	value: function() {
		return this.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
});
  
/**
 * Static class with utilities used throughout the bot.
 */
class Utils {
	constructor() {
	  throw new Error("Utils is a static class and cannot be instantiated.");
	}

	static Log() {
		return {
				success(type, success) {
					return console.log(chalk.green(`[${nows()}] | [SUCCESS][${type}]: ${success}`));
				},
				warn(type, warning) {
					return console.warn(chalk.yellow(`[${nows()}] | [WARNING][${type}]: ${warning}`));
				},
				error(type, error) {
					return console.error(chalk.red(`[${nows()}] | [ERROR][${type}]: ${error}`));
				},
				debug(type, debug) {
					return console.log(chalk.black(`[${nows()}] | [DEBUG][${type}]: ${debug}`));
				},
				log(type, message) {
					return console.log(`[${nows()}] | [INFO][${type}]: ${message}`);
				}
		};
	}

	static shuffle(array) {
		const arr = array.slice(0);
    new Promise(async resolve => {
      resolve(2);
      try{
        for (let i = arr.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      } catch {}
    })
		return arr;
	}

	static delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static arrayEquals(a, b) {
		return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, i) => val === b[i]);
	}

	static sortByName(arr, prop) {
		return arr.sort((a, b) => {
			if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
			return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
		});
	}

	static firstUpperCase(text, split = ' ') {
		return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
	}

	static formatNumber(number, minimumFractionDigits = 0) {
		return Number.parseFloat(number).toLocaleString(undefined, {
			minimumFractionDigits,
			maximumFractionDigits: 2,
		});
	}

	static formatNumberK(number) {
		return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
	}

	static randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static base64(text, mode = 'encode') {
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
	}

	static hash(text, algorithm) {
		return crypto.createHash(algorithm).update(text).digest('hex');
	}

	static today(timeZone) {
		const now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
		return now;
	}

	static tomorrow(timeZone) {
		const today = Util.today(timeZone);
		today.setDate(today.getDate() + 1);
		return today;
	}
  
  static charsTotime(x) {
    return x >= 32 ? -22 + 6.44 * Math.log(x) : 0
  }

  static msToTime(ms) {
    const days = Math.floor(ms / 86400000); // 24*60*60*1000
    const daysms = ms % 86400000; // 24*60*60*1000
    const hours = Math.floor(daysms / 3600000); // 60*60*1000
    const hoursms = ms % 3600000; // 60*60*1000
    const minutes = Math.floor(hoursms / 60000); // 60*1000
    const minutesms = ms % 60000; // 60*1000
    const sec = Math.floor(minutesms / 1000);

    let str = '';
    if (days) str = `${str + days}d`;
    if (hours) str = `${str + hours}h`;
    if (minutes) str = `${str + minutes}m`;
    if (sec) str = `${str + sec}s`;

    return str;
  }

	static async reactIfAble(message, user, emoji, fallbackEmoji) {
		const dm = !message.guild;
		if (fallbackEmoji && (!dm && !message.channel.permissionsFor(user).has('USE_EXTERNAL_EMOJIS'))) {
			emoji = fallbackEmoji;
		}
		if (dm || message.channel.permissionsFor(user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
			try {
				await message.react(emoji);
			} catch {
				return null;
			}
		}
		return null;
	}

	static async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
		const filter = res => {
			const value = res.content.toLowerCase();
			return (user ? res.author.id === user.id : true)
				&& (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
		};
		const verify = await channel.awaitMessages(filter, {
			max: 1,
			time
		});
		if (!verify.size) return 0;
		const choice = verify.first().content.toLowerCase();
		if (yes.includes(choice) || extraYes.includes(choice)) return true;
		if (no.includes(choice) || extraNo.includes(choice)) return false;
		return false;
	}

	static cleanAnilistHTML(html, removeLineBreaks = true) {
		let clean = html;
		if (removeLineBreaks) clean = clean.replace(/\r|\n|\f/g, '');
		clean = clean
			.replace(/<br>/g, '\n')
			.replace(/&#039;/g, '\'')
			.replace(/&quot;/g, '"')
			.replace(/<\/?i>/g, '*')
			.replace(/<\/?b>/g, '**')
			.replace(/~!|!~/g, '||')
			.replace(/&mdash;/g, '—');
		if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
		const spoilers = (clean.match(/\|\|/g) || []).length;
		if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += '||';
		return clean;
	}

	static list(arr, conj = 'and') {
		const len = arr.length;
		if (len === 0) return '';
		if (len === 1) return arr[0];
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static shorten(text, maxlen = 1999) {
		if(!text) throw new ReferenceError("Shikishima => 'text' must be passed down as param! (shorten)");
		if(typeof maxlen !== "number") throw new ReferenceError("Shikishima => typeof 'maxlen' must be a number! (shorten)");
		return text.length > maxlen ? `${text.substr(0, maxlen - 3)}...` : text;
	}

	static trimArray(arr, number) {
		if(!arr) throw new ReferenceError("Shikishima => 'arr' must be passed down as param! (trimArray)");
		if(typeof number !== "number") throw new ReferenceError("Shikishima => typeof 'number' must be a number! (trimArray)");
		if(arr.length > number) {
			const len = arr.length - number;
			arr = arr.slice(0, number);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static removeFromArray(arr, value) {
		const index = arr.indexOf(value);
		if (index > -1) return arr.splice(index, 1);
		return arr;
	}

	static removeDuplicates(arr) {
		if (arr.length === 0 || arr.length === 1) return arr;
		const newArr = [];
    new Promise(async resolve => {
      resolve(2);
      try{
        for (let i = 0; i < arr.length; i++) {
          if (newArr.includes(arr[i])) continue;
          newArr.push(arr[i]);
        }
      } catch {}
    })
		return newArr;
	}

	static stripInvites(str, { guild = true, bot = true, text = '[redacted invite]' } = {}) {
		if (guild) str = str.replace(inviteRegex, text);
		if (bot) str = str.replace(botInvRegex, text);
		return str;
	}

	static embedURL(title, url, display) {
		return `[${title}](${url.replace(')', '%29')}${display ? ` "${display}"` : ''})`;
	}

  static cleanGuildName(name) {
    let ignoreReg = [
      "(( *)(servers|server|guilds|guild|officials|official))",
      "((servers|server|guilds|guild|officials|official)( *))",
      "((servers|server|guilds|guild|officials|official))", ],
      ignore = new RegExp(ignoreReg.join("|"), "i");

    return name.toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
    .replace(ignore, "")
    .replace(ignore, "")
    .replace(ignore, "").toProperCase();
  }

	static BaseEmbed(message) {
		if(!message) {
			throw new ReferenceError("Shikishima => 'message' must be passed down as param! (BaseEmbed)");
		}
		const avatar = message.author.displayAvatarURL({
			dynamic: true
	});
	return new Discord.MessageEmbed().setFooter(message.author.username, avatar).setColor(color.none).setTimestamp();

	}


  static async sendWebhook(message, content, { guild = undefined, channel = undefined, username = "Nekoyasui", avatar = "https://cdn.discordapp.com/attachments/797438840151212052/809055291824013323/static.png?size=4096"} = {}){
  //client.util.sendWebhook(message, content, { guild : undefined, channel : undefined, username : "Nekoyasui", avatar : h})
  if(!message && !guild) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (sendWebhook)");
  if(!content) throw new ReferenceError("Shikishima => 'content' must be passed down as param! (sendWebhook)");
  //if(guild && typeof guild !== 'number') throw new SyntaxError("Shikishima => 'guild' must be a number type! (sendWebhook)");
  //if(channel && typeof channel !== 'number') throw new SyntaxError("Shikishima => 'channel' must be a number type! (sendWebhook)");
  if(username && typeof username !== 'string') throw new SyntaxError("Shikishima => 'username' must be a string type! (sendWebhook)");
  if(avatar && typeof avatar !== 'string') throw new SyntaxError("Shikishima => 'avatar' must be a string type! (sendWebhook)");
  if(message && !guild) guild = message.guild;
  if(!channel) channel = message.channel;
    try{
      if (guild.me.permissionsIn(channel).has(["SEND_MESSAGES"]) === true && channel) {
        if(guild.me.permissionsIn(channel).has("MANAGE_WEBHOOKS")) {
          return await channel.createWebhook(username, {avatar: avatar}).then((webhook) => {
            webhook.send(content).then(async() => {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await webhook.delete();
            });
          });
        } else {
          console.log("I don't have permission to make a webhook.");
          return await channel.send(content);
        }
      }
    } catch (e) {
      this.Log().error("Webhook", `${e.name}: ${e.stack}`);
    }
  }

	static read_file(path) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, (error, data) => {
				if(error) {
					reject(error)
				}
				if(path.endsWith(".json")) {
					resolve(JSON.parse(data))
				} else {
					resolve(data)
				}
			})
		})
	}

    /**
     * Gets all files in a folder.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     * @param {String} extension
     */
  static getAllFiles(dirPath, arrayOfFiles, extension) {
      dirPath = dirPath.split('/').filter(s=>s.length).join('/');
      var files = fs.readdirSync(dirPath)
      
      arrayOfFiles = arrayOfFiles || [];

      files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          arrayOfFiles = Utils.getAllFiles(dirPath + "/" + file, arrayOfFiles, extension)
        } else {
          if(!file.endsWith(extension || "") && !fs.statSync(dirPath + "/" + file).isFile()) return;
          if(file.endsWith(".DS_Store")) return;
          arrayOfFiles.push(dirPath + '/' + file)
        }
      })
      return arrayOfFiles;
  };

  /**
   * Adds all file sizes to get one large one.
   * @param {String} directory 
   */
  static getCombinedSize(arrayOfFiles) {
      let totalSize = 0

      arrayOfFiles.forEach(function(filePath) {
        totalSize += fs.statSync(filePath).size;
      })
    
      return totalSize;
  }
	static getCodeBlock(txt) {
		const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
		if(!match) return { lang: null, code: txt };
		if(match[1] && !match[2]) return { lang: null, code: match[1] };
		return { lang: match[1], code: match[2] };
	}

	static async clean (client, text) {
		text = require("util").inspect(text, {depth: 1});
		if (text && text.constructor.name == "Promise"){
			text = await text;
		}

		if (typeof text === "string"){
			text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, '*'.repeat(client.token.length));
		}

		return text;
	}

  static async removeReactionSlowdown() {
  const fs = require("fs").promises;
  const filePath =  process.cwd() + "/node_modules/discord.js/src/rest/RequestHandler.js";

      const file = await fs.readFile(filePath, { encoding: "utf8" }, () => {});

      const found = file.match(/getAPIOffset\(serverDate\) \+ 250/gim);

      if (found) {
          console.log(
              "Removing additional 250ms timeout for reactions.\nWill need to restart process for changes to take effect."
          );
          const newFile = file.replace(
              /getAPIOffset\(serverDate\) \+ 250/gim,
              "getAPIOffset(serverDate)"
          );
          await fs.writeFile(filePath, newFile, { encoding: "utf8" }, () => {});
          return process.exit();
      }
  }

  static async searchUser(message, query) {
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchUser)");
    if(!query || query.length === 0) throw new ReferenceError("Shikishima => 'query' must be passed down as param! (searchUser)");
    if(query && typeof query !== "string") throw new ReferenceError("Shikishima => 'query' must be passed down as string! (searchUser)");

    var final;
    let cache = message.client.users.cache;
    let api = message.client.api;

    // Discord Mention\
    if(query.match(/^(?:<@!?)?(\d{16,22})>/gi)) {
      let regex = new RegExp(/^(?:<@!?)?(\d{17,19})>/gi),
      result = await cache.get(regex.exec(query)[1]) || await api.users(regex.exec(query)[1]).get();
      final = result;
    }
    // Discord ID
    else if(query.match(/\d{16,22}$/gi)) {
      let result = await cache.get(query) || await api.users(query).get();
      final = result;
    }
    // Username
    else if(query.match(/^.{1,32}$/gi)) {
      let mappingUsername = await cache.map(x => x.username.toLowerCase()).filter(function(x) {
        return x != null
      });
      let combineMapping = mappingUsername;
      let similarFound = this.findMatch(query, combineMapping).best.target;
      let userRegex = new RegExp(similarFound, "i");
      let finale = await cache.find(x => userRegex.test(x.username) || x.username === similarFound );
      final = finale;
    }
    // Unknown
    else if(!final) {
      console.log("I could'nt find the user.");
      return undefined;
    }
    // Final
    return final;
  };

  static async searchMember(message, query, { current = false } = {}) {
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchMember)");
    if(current && typeof current !== "boolean") throw new ReferenceError("Shikishima => 'current' must be passed down as boolean! (searchMember)");
    if(!query && current) query = message.author.id;
    if(!query || query.length === 0) return undefined;

    var final;
    let cache = message.guild.members.cache;

    // Discord Mention\
    if(query.match(/^(?:<@!?)?(\d{16,22})>/gi)) {
      let regex = new RegExp(/^(?:<@!?)?(\d{17,19})>/gi),
      result = await cache.get(regex.exec(query)[1]);
      final = result;
    }
    // Discord ID
    else if(query.match(/\d{16,22}$/gi)) {
      let result = await cache.get(query);
      final = result;
    }
    // Discord Join Position
    else if(query.match(/\d{1,7}$/gim)) {
      const position = await cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).array();
      let result = await position[parseInt(query)];
      final = result;
    }
    // Discord Tag
    else if(query.match(/^.{1,32}(#)+\d{4}$/gim)) {
      let finale = await cache.find(x => x.user.tag === query);
      final = finale;
    }
    // Username/Nickname
    else if(query.match(/^.{1,32}$/gi)) {
      let mappingNickname = await cache.map(x => x.nickname).filter(function(x) {
        return x != null
      });
      let mappingUsername = await cache.map(x => x.user.username).filter(function(x) {
        return x != null
      });
      let combineMapping = mappingNickname.length >= 1 ? mappingUsername.concat(mappingNickname) : mappingUsername;
      let similarFound = this.findMatch(query, combineMapping).best.target;
      let userRegex = new RegExp(similarFound, "i");
      let finale = await cache.find(x => userRegex.test(x.user.username) ? x.user.username === similarFound : x.nickname === similarFound);
      final = finale;
    }
    // Unknown
    else if(!final) {
      console.log("I could'nt find the user.");
      return undefined;
    }
    // Final
    return final;
  };

  static async searchChannel(message, query, { current = false } = {}) {
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchChannel)");
    if(current && typeof current !== "boolean") throw new ReferenceError("Shikishima => 'current' must be passed down as boolean! (searchMember)");
    if(!query && current) query = message.channel.id;
    if(!query || query.length === 0) return undefined;

    var final;
    let cache = message.guild.channels.cache;

    // Discord Mention
    if(query.match(/^(?:<#?)?(\d{16,22})>$/gi)) {
      let regex = new RegExp(/^(?:<#?)?(\d{17,19})>$/gi),
      result = await cache.get(regex.exec(query)[1]);
      final = result;
    }
    // Discord ID
    else if(query.match(/\d{16,22}$/gi)) {
      let result = await cache.get(query);
      final = result;
    }
    // Query only
    else if(query.match(/^.{1,100}$/gi)) {
      let mappingChannel = await cache.map(x => x.name).filter(function(x) {
        return x != null
      });
      let similarFound = this.findMatch(query, mappingChannel).best.target;
      let finale = await cache.find(x => x.name === similarFound);
      final = finale;
    }
    // Unknown
    else if(!final) {
      console.log("I could'nt find the channel.");
      return undefined;
    }
    // Final
    return final;
  };

  static async searchRole(message, query) {
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchRole)");
    if(!query || query.length === 0) return undefined;

    var final;
    let cache = message.guild.roles.cache;

    // Discord Mention
    if(query.match(/^(?:<@&?)?(\d{16,22})>$/gi)) {
      let regex = new RegExp(/^(?:<@&?)?(\d{17,19})>$/gi),
      result = await cache.get(regex.exec(query)[1]);
      final = result;
    }
    // Discord ID
    else if(query.match(/\d{16,22}$/gi)) {
      let result = await cache.get(query);
      final = result;
    }
    // Query only
    else if(query.match(/^.{1,50}$/gi)) {
      let mappingRoles = await cache.map(x => x.name).filter(x => x !== `@everyone`).filter(function(x) {
        return x != null
      });
      let similarFound = this.findMatch(query, mappingRoles).best.target;
      let finale = await cache.find(x => x.name === similarFound);
      final = finale;
    }
    // Unknown
    else if(!final) {
      console.log("I could'nt find the role.");
      return undefined;
    }
    // Final
    return final;
  };

  static async searchEmoji(message, query) {
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchEmoji)");
    if(!query || query.length === 0) return undefined;

    var final;
    let cache = message.guild.emojis.cache;

    // Discord Mention
    if(query.match(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi)) {
      let regex = new RegExp(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi),
      result = await cache.get(regex.exec(query)[1]);
      final = result;
    }
    // Discord ID
    else if(query.match(/\d{16,22}$/gi)) {
      let result = await cache.get(query);
      final = result;
    }
    // Query only
    else if(query.match(/^.{1,50}$/gi)) {
      let mappingEmojis = await cache.map(x => x.name).filter(function(x) {
        return x != null
      });
      let similarFound = this.findMatch(query, mappingEmojis).best.target;
      let finale = await cache.find(x => x.name === similarFound);
      final = finale;
    }
    // Unknown
    else if(!final) {
      console.log("I could'nt find the emoji.");
      return undefined;
    }
    // Final
    return final;
  };

  //Find the best Match
  static findMatch(mainString, targetStrings) {
    if(!this.validArgs(mainString, targetStrings)) throw new Error("Bad arguments: The first argument should be a string, the second one should be a string array.");
    const ratings = [];
    let matchIndex = 0;
    for(let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = this.compareStrings(mainString, currentTargetString)
      ratings.push({
        target: currentTargetString,
        rating: currentRating
      })
      if(currentRating > ratings[matchIndex].rating) {
        matchIndex = i
      }
    }
    return {
      ratings: ratings,
      best: ratings[matchIndex],
      matchIndex: matchIndex
    };
  }

  // Valid args.
  static validArgs(mainString, targetStrings) {
    if(typeof mainString !== 'string') return false;
    if(!Array.isArray(targetStrings)) return false;
    if(!targetStrings.length) return false;
    if(targetStrings.find(function(s) {
        return typeof s !== 'string'
      })) return false;
    return true;
  };

  // Compare two strings.
  static compareStrings(first, second) {
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')
    if(first === second) return 1; // identical or empty
    if(first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string
    let firstBigrams = new Map();
    for(let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
      firstBigrams.set(bigram, count);
    };
    let intersectionSize = 0;
    for(let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
      if(count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }
    return(2.0 * intersectionSize) / (first.length + second.length - 2);
  }

  static async checkUserRoles(message, { user = undefined, roles } = {}){
    if(!message) throw new ReferenceError("Shikishima => 'message' must be passed down as param! (searchRole)");
    if(!(roles) || roles.length === 0) throw new ReferenceError("Shikishima => 'roles' must be passed down as param! (searchRole)");

    let member = await this.searchMember(message, user, { current: true });
    if(!(member)) return false;
    let res = false;
    if(typeof roles == "string") {
      //console.log("'string' => passed")
        let role = await this.searchRole(message, roles);
        if(!(role)) { res = true; } else { 
          if(member.roles.cache.has(role.id)) res = true;
        }
    } else {
      //console.log("'array' => passed")
      try{
        for (let i = 0; i < roles.length; i++) {
          let role = await this.searchRole(message, roles[i]);
          if(!(role)) { 
            res = true;
            break;
          } else { 
            if(!(roles[i] === undefined)){
              if(member.roles.cache.has(role.id)) {
                res = true;
                break;
              }
            }
          }
        }
      } catch {}
      /*roles.map(async(value) => {
        let role = await this.searchRole(message, value);
        if(!(member.roles.cache.has(role.id))) { 
          console.log(`User does'nt have ${role.name} role.`);
          res.push(`<@&${role.id}>`); 
        } else {
          console.log(`User have ${role.name} role.`);
        }
      });*/
    }
    return res;
  }

  static bitNumberToArray(n) {
    const bits = [...n.toString(2)].map(Number);
    return bits.reduce((result, bit, index) => result.concat(bit ? bits.length - index - 1 : []), []);
  }

  static isArrayNumbers(arr) {
    return arr.reduce(function(result, val) {
      return result && typeof val === 'number';
    }, true);
  }
}

module.exports = Utils;