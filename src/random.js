import play from "./meme/play.js";
import memes from "./memes.js";

export default async function ({ msg, stats }) {
  const names = [...memes.keys()];
  const name = names[Math.floor(Math.random() * names.length)];
  const meme = memes.get(name);
  await msg.channel.send(`:loud_sound: ${name}`);
  await play({ msg, meme, stats });
}