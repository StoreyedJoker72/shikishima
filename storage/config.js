const config = {
	ownerID: "817238971255488533", //This is required for Bot owner commands only
	bot: {
		id: "819580119713710101",
		requirements: [ "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"]
	},
	radioURL: "https://streema.com/",
	port: 8080,
	reqByteLimit: 100000,
  hr: "~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~~~- -~~- ",
  emojis: {
    yes: "<a:yes:840645403875737622>",
    no: "<a:no:840645535089950740>",
    loading: "<a:loading:859418408159281203>",
		ping: "<a:ping:859418738419826688>",
    api: "<:api:859420095440093224>",
		upvote: "<a:upvote:859418864554868736>",
		downvote: "<a:downvote:859418961938743297>",
		joined: "<:joined:859419139746693161>",
		leaved: "<:leaved:859419081697263636>",
    bot: "<:bot:859420713696755743>",
    online: "🟢",
    idle: "🟠",
    dnd: "🔴",
    offline: "⚫"
  },
	languages: {
		default: {
			en: {
				id: "en",
				name: "english",
				nativeName: "English"
			},
			tl: {
				id: "tl",
				name: "tagalog",
				nativeName: "Wikang Tagalog"
			},
			ja: {
				id: "ja",
				name: "japanese",
				nativeName: "日本語 (にほんご／にっぽんご)"
			},
			fr: {
				id: "fr",
				name: "French",
				nativeName: "français, langue française",
			},
			es: {
				id: "es",
				name: "Spanish; Castilian",
				nativeName: "español, castellano",
			},
			pt: {
				id: "pt",
				name: "Portuguese",
				nativeName: "Português",
			},
			zh: {
				id: "zh",
				name: "Chinese",
				nativeName: "中文 (Zhōngwén), 汉语, 漢語",
			},
			ko: {
				id: "ko",
				name: "Korean",
				nativeName: "한국어 (韓國語), 조선말 (朝鮮語)",
			}
		}
	}
};

module.exports = config;