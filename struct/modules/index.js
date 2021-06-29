const fs = require("fs"),
util = require("../utilities/utils");

module.exports = (client) => {
  const extensions = fs.readdirSync(__dirname).filter(files => files.endsWith(".js") && files !== "index.js");

  if (extensions.length <= 0) return util.Log().warn("Modules Handling", `Could not find any events listener at  ${__dirname} folder`);

      for(const file of extensions) {
          const Name = file.split(".")[0];
          util.Log().success("Modules Handling", Name.toProperCase());

          require(`./${file}`)(client);
      }
  client.on("ready", async () => {
      require("../utilities/server/keepalive");
  })
}
