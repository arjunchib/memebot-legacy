import fs from "fs";
import Discord from "discord.js";
import parseMeme from "./meme/index.js";
import list from "./list/index.js";

async function loadMemes() {
  const files = await fs.promises.readdir("./memes");
  const promises = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => fs.promises.readFile(`./memes/${file}`, "utf8"))
    .map((promise) => promise.then(JSON.parse));
  return await Promise.all(promises);
}

(async () => {
  const client = new Discord.Client({
    ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] },
  });
  const prefix = "!ml";
  const memes = await loadMemes();
  const lookup = new Map(JSON.parse(fs.readFileSync("./lookup.json")));

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", async (msg) => {
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content
      .split(" ")
      .filter((x) => x !== "")
      .slice(1);
    const arg = args.shift().split(":");
    switch (arg[0]) {
      case "list": {
        const field = arg.length === 2 ? arg[1] : undefined;
        list({ memes, msg, args, field });
        break;
      }
      default: {
        const name = lookup.get(arg[0].toLowerCase());
        const meme = memes.find((meme) => meme.name.toLowerCase() === name);
        parseMeme({ meme, msg, args });
        break;
      }
    }
  });

  client.login(process.env.BOT_TOKEN);
})();
