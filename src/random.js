import play from "./meme/play.js";
import Meme from "./structures/Meme.js";

export default async function ({ msg, stats, client }) {
  const names = [...Meme.all.keys()];
  const name = names[Math.floor(Math.random() * names.length)];
  const meme = Meme.all.get(name);
  if (await play({ msg, meme, stats, client })) {
    await msg.channel.send(`:loud_sound: ${name}`);
  }
}
