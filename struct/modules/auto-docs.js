const fs = require("fs"), pkg = require(`${process.cwd()}/package.json`);

module.exports = async (client) => {
  client.on("ready", async () => {
    try {
      let categories = client.helps.array().filter((x) => !x.hide),
      docs = `# Command List - ${pkg.name}  \n> Command list generated [here](https://github.com/Nekoyasui/${pkg.name}/blob/master/struct/modules/auto-docs.js)\n`;

      for (const category of categories) {
        if(!(category.cmds.length === 0 || "xxx".includesOf(category.cmds))){
        const commands = category.cmds.filter((x) => !x.includes("xxx")).map((name) =>
        `| [${client.commands.get(name).help.name}](https://github.com/NekoYasui/${pkg.name}/blob/master/commands.md#${client.commands.get(name).help.name}) | ${client.commands.get(name).help.description} |`
        ).join("\n");

docs +=
`\n
### ❯ \`${category.reaction}\` ${category.name.toLowerCase()}
| Name | Description |
| ---- | ----------- |
${commands}`;
       }
      }

      docs += "\\\n\n# Detailed Command List\n";
      for (const category of categories) {
        if(!(category.cmds.length === 0 || "xxx".includesOf(category.cmds))){
        const commands = category.cmds.filter((x) => !x.includes("xxx")).map((name) =>
        `### ${client.commands.get(name).help.name.toProperCase()}\nCommand: ${client.commands.get(name).help.name.toLowerCase()}\\\nDescription: ${client.commands.get(name).help.description}\\\nUsage: ${client.commands.get(name).help.usage ? client.commands.get(name).help.usage.length !== 0 ? client.commands.get(name).help.usage.map((usage) => `${usage ? usage : "None"}`).join(" ") : "None" : "None"}\\\nExamples: ${client.commands.get(name).help.examples ? client.commands.get(name).help.examples.length !== 0 ? client.commands.get(name).help.examples.map((examples) => `${examples ? examples : "None"}`).join("| ") : "None" : "None"}\\\nBot Permission: ${client.commands.get(name).requirements.bot ? client.commands.get(name).requirements.bot.length !== 0 ? client.commands.get(name).requirements.bot.map((bot) => `${bot ? bot : "None"}`).join(", ") : "None" : "None"}\\\nUser Permission: ${client.commands.get(name).requirements.user ? client.commands.get(name).requirements.user.length !== 0 ? client.commands.get(name).requirements.user.map((user) => `${user ? user : "None"}`).join(", ") : "None" : "None"}\\\n`
        ).join(`[Back to top](https://github.com/NekoYasui/${pkg.name}/blob/master/commands.md#command-list---${pkg.name})\n\n`);

docs +=
`\n
## ${category.name.toUpperCase()}
${commands}`;
        }
      }

      if (fs.existsSync(`${process.cwd()}/commands.md`)) {
          fs.writeFileSync(`${process.cwd()}/commands.md`, docs.trim());
          client.util.Log().success("Documentations", "Command list updated");
      } else {
          client.util.Log().warn("Documentations", `Create ${process.cwd()}/docs/commands.md`);
      }
    } catch (e) {
      return client.util.Log().error("Documentations", `❌ | ${e.name} : ${e.stack}`);
    }
  })
}