exports.run = async (client, message, Discord) => { // eslint-disable-line no-unused-vars
  try { // Put your Code Here.

        const before = Date.now();
        message.channel.send("*🏓 Pinging...*").then((msg) => {
            const latency = Date.now() - before;
            const wsLatency = client.ws.ping.toFixed(0);
            const embed = client.util.BaseEmbed(message)
                .setAuthor("🏓 PONG!")
                .setColor(searchHex(wsLatency))
                .setTimestamp()
                .addFields({
                name: "API Latency",
                value: `**\`${latency}\`** ms`,
                inline: true
            }, {
                name: "WebSocket Latency",
                value: `**\`${wsLatency}\`** ms`,
                inline: true
            })
            msg.edit(embed);
            msg.edit("");
        })
    function searchHex(ms) {
        const listColorHex = [
            [0, 20, "#51e066"],
            [21, 50, "##51c562"],
            [51, 100, "#edd572"],
            [101, 150, "#e3a54a"],
            [150, 200, "#d09d52"]
        ];
        const defaultColor = "#e05151";
        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret = "#36393f";
        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            }
            else {
                ret = defaultColor;
            }
        }
        return ret;
    }
    } catch (e) { // End of the Code.
    client.functions.sendLogs(message, e, "error");
  }
};

exports.help = {
  name: "ping",
  description: "Get latency details!",
  examples: [],
  usage: [],
  type: []
};

exports.conf = {
  aliases: ["latency"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};

exports.requirements = {
  owner: false,
  guildOnly: true,
  nsfwOnly: false,
  usage: false,
  type: false,
  client: [],
  user: [],
};
