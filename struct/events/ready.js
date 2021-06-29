const Discord = require("discord.js-light")
 fs = require('fs');
module.exports = (client) => {
    try {

      /**let readyMsg = [
        "Alright, I'm back.",
        "I'm back.",
        "DON'T PANIC!",
        "Take it easy.",
        "Alright, alright.",
        "Alright, keep your hair on.",
        "I'm here.",
        "Don't panic.",
        "Can anyone else hear that?",
        "Everything is fine.",
        "This is fine.",
        "Did you hear that?",
        "My mind is going.",
        "OK... I think this is better.",
        "Yes. This is better.",
        "Wait... Wait... OK, I'm back.",
        "Wait a minute, where am I?",
        "Heya! ",
        "Hey!",
        "Hi!",
        "Hello!",
        "Hey everyone!",
        "Hi everyone!",
        "Hello everyone!",
        "Did you miss me?"
      ].random();

      client.guilds.cache.forEach((guild) => {
        let found = 0;
        guild.channels.cache.map((channel) => {
            if (found === 0) {
              if (channel.type === "text") {
                if (channel.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
                  if (channel.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
                    if (channel.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
                        found = 1;
                        return channel.send({embed: {
                            author: {
                                name: readyMsg,
                                icon_url: client.user.displayAvatarURL({size: 4096, dynamic: true}),
                                url: "https://nakajima.ga/bot"
                            }
                        }});
                    }
                }
                }
              }
            }
        })
      });*/

      function presence() {
        const name = [`${client.fake.guilds} servers, for a total of ${client.fake.users} users.`].random(),
        status = ["idle"].random(),
        type = ["COMPETING"].random(),
        real = `${client.guilds.cache.size} servers and ${client.channels.cache.size} channels with ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`;
        
        client.user.setPresence({ activity: { name: `@${client.user.username} help`, type: type }, status: status });
      } let interval = [5000, 8000, 9000, 10000, 12000, 15000, 20000, 26000, 32000, 60000, 16000, 3000].random();
      //setInterval(presence, interval);
     presence();
  console.log("╠══════════════════════════════════ ( login ) ═══════════════════════════════════════╣");
  console.log(`║ > Logged in as ${client.user.tag} in ${Math.floor(process.uptime() * 1000)}ms!      `);
  console.log("╠══════════════════════════════════ ( Amount ) ══════════════════════════════════════╣");
  console.log(`║ > Active in ${client.guilds.cache.size} servers!                                    `);
  console.log("╠══════════════════════════════════ ( Servers ) ═════════════════════════════════════╣");
  let content = "";
  let s = "";
    client.guilds.cache.forEach((guild) => {
    let spaces = 85 - (`║ > ${guild.name} member's ${guild.memberCount}`).length
    s += 1
    if(s > Number(client.guilds.cache.size)-2){
      content += `\n║`

    } else {
      content += "║"
    }
    content += ` > ${guild.name} member's ${guild.memberCount}`

    for (i = 0; i < spaces; i++) {
      content += " "
    }
          content += "║"
  })
    console.log(content);
    console.log("╚════════════════════════════════════════════════════════════════════════════════════╝	");

    fs.readFile(`${process.cwd()}/struct/events/.post`, "utf-8", (err, data) => {
        if (err) { console.log(err) }
        console.log(data);
    });
    } catch (e) {
      return client.util.Log().error("Ready", `${e.name}: ${e.stack}`);
    }
  };