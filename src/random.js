import play from "./meme/play.js";
import Meme from "./structures/Meme.js";

export default async function ({ msg, stats, client }) {
  const memes = Meme.getAll();
  const meme = memes[Math.floor(Math.random() * memes.length)];
  if (await play({ msg, meme, stats, client })) {
    await msg.channel.send(`:loud_sound: ${meme.name}`);
  }
}
