import Discord from "discord.js";
import parseMeme from "./meme/index.js";
import list from "./list/index.js";
import memes from "./util/memes.js";
import add from "./add.js";
import help from "./help.js";
import search from "./search.js";
import random from "./random.js";
import access from "./util/access.js";
import Stats from "./util/stats.js";

const client = new Discord.Client({
  ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] },
});
const prefix = process.env.PREFIX;
const stats = new Stats(client);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  stats.logGuildChange(0);
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
        if (access(msg, 1)) await add({ msg, args });
        break;
      case "help":
        help({ msg, prefix });
        break;
      case "search":
        search({ msg, args });
        break;
      case "random":
        random({ msg, stats, client });
        break;
      default: {
        if (!memes.has(arg[0].toLowerCase())) {
          await msg.react("🚫");
          return;
        }
        const meme = memes.get(arg[0].toLowerCase());
        await parseMeme({ msg, args, meme, stats, client });
        break;
      }
    }
  } catch (e) {
    console.log(e);
    msg.channel.send(`⛔️ ${e.message} ⛔️`);
  }
});

client.on("guildCreate", async (guild) => {
  if (guild.systemChannel) {
    await guild.systemChannel.send(`${prefix} help`);
  }
  stats.logGuildChange(1);
});
client.on("guildDelete", () => stats.logGuildChange(-1));

client.login(process.env.BOT_TOKEN);
