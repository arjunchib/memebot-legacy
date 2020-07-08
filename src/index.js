import Discord from "discord.js";
import parseMeme from "./meme/index.js";
import list from "./list/index.js";
import memes from "./memes.js";
import lookup from "./lookup.js";
import add from "./add.js";

const client = new Discord.Client({
  ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] },
});
const prefix = "!ml";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  try {
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content
      .split(" ")
      .filter((x) => x !== "")
      .slice(1);
    const arg = args.shift().split(":");
    switch (arg[0]) {
      case "list": {
        const field = arg.length === 2 ? arg[1] : undefined;
        await list({ msg, args, field });
        break;
      }
      case "add":
        add({ msg, args });
        break;
      default: {
        const name = lookup.get(arg[0].toLowerCase());
        const meme = memes.find((meme) => meme.name.toLowerCase() === name);
        await parseMeme({ meme, name: arg[0].toLowerCase(), msg, args });
        break;
      }
    }
  } catch (e) {
    console.log(e);
    msg.channel.send(e.message);
  }
});

client.login(process.env.BOT_TOKEN);
