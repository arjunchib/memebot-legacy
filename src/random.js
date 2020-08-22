import play from "./meme/play.js";
import memes from "./util/memes.js";

export default async function ({ msg, stats, client }) {
  const names = [...memes.keys()];
  const name = names[Math.floor(Math.random() * names.length)];
  const meme = memes.get(name);
  if (await play({ msg, meme, stats, client })) {
    await msg.channel.send(`:loud_sound: ${name}`);
  }
}
