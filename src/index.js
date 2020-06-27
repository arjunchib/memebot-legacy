import Discord from "discord.js";
import play from "./commands/play.js";
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
  switch (msg.content) {
    default:
      play({ msg, args });
      break;
  }
});

client.login(process.env.BOT_TOKEN);
