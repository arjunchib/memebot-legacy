import Discord from "discord.js";
import meme from "./meme/index.js";
import list from "./list/index.js";
import add from "./add.js";
import help from "./help.js";
import search from "./search.js";
import random from "./random.js";
import StatManager from "./structures/StatManager.js";
import Meme from "./structures/Meme.js";

const client = new Discord.Client({
  ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] },
});
const prefix = process.env.PREFIX;
const stats = new StatManager(client);
const commands = { list, add, help, search, random };
(async () => await Meme.loadAll())();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  stats.logGuildChange(0);
});

client.on("message", async (msg) => {
  try {
    if (!msg.content.startsWith(`${prefix} `)) return;
    const args = msg.content
      .split(" ")
      .filter((x) => x !== "")
      .slice(1);
    const arg = args.shift().split(":");
    const context = { msg, args, arg, prefix, stats, client };
    const cmd = arg[0].toLowerCase();
    if (Object.keys(commands).includes(cmd)) {
      await commands[cmd](context);
    } else {
      await meme(context);
    }
  } catch (e) {
    console.log(e);
    msg.channel.send(`⛔️ ${e.message} ⛔️`);
    msg.channel.stopTyping(true);
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
