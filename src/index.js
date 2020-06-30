import Discord from "discord.js";
import meme from "./meme/index.js";
import list from "./list/index.js";
const client = new Discord.Client({
  ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] },
});
const prefix = "!ml";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content
    .split(" ")
    .filter((x) => x !== "")
    .slice(1);
  switch (args[0].split(":")[0]) {
    case "list":
      list({ msg, args });
      break;
    default:
      meme({ msg, args });
      break;
  }
});

client.login(process.env.BOT_TOKEN);
