import fs from "fs/promises";
import memes from "../memes.js";
import lookup from "../lookup.js";

export default async function ({ msg, meme }) {
  const audioPath = `./data/audio/${meme.name}.opus`;
  const memePath = `./data/memes/${meme.name}.json`;
  await fs.unlink(audioPath);
  await fs.unlink(memePath);
  memes.delete(meme.name);
  [meme.name, ...meme.aliases].forEach((cmd) => lookup.delete(cmd));
  await msg.react("🚮");
}
