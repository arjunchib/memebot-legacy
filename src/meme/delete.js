import fs from "fs/promises";
import memes from "../util/memes.js";

export default async function ({ msg, meme }) {
  const audioPath = `./data/audio/${meme.name}.opus`;
  const memePath = `./data/memes/${meme.name}.json`;
  await fs.unlink(audioPath);
  await fs.unlink(memePath);
  [meme.name, ...meme.aliases].forEach((cmd) =>
    memes.delete(cmd.toLowerCase())
  );
  await msg.react("🚮");
}
