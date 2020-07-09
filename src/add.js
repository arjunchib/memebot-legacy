import ytdl from "ytdl-core";
import prism from "prism-media";
import memes from "./memes.js";
import info from "./meme/info.js";
import fs from "fs";
import lookup from "./lookup.js";

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
  const audioPath = `./audio/${name}.opus`;
  const memePath = `./memes/${name}.json`;
  try {
    const input = ytdl(sourceURL);
    const transcoder = new prism.FFmpeg({
      // prettier-ignore
      args: [
      "-analyzeduration", "0",
      "-loglevel", "0",
      "-ss", start,
      "-t", end,
      "-async", "1",
      "-filter:a", "loudnorm",
      "-c:a", "libopus",
      "-f", "ogg",
    ]
    });
    const file = fs.createWriteStream(audioPath);
    input.pipe(transcoder).pipe(file);
    const meme = {
      name,
      createdAt: new Date(),
      author: {
        name: msg.author.username,
        id: msg.author.id,
      },
      sourceURL,
      start,
      end,
      volume: 1,
      aliases,
      tags: [],
    };
    memes.push(meme);
    [name, ...aliases].forEach((cmd) => lookup.set(cmd, name));
    await fs.promises.writeFile(memePath, JSON.stringify(meme, null, 2));
    await fs.promises.writeFile(`./lookup.json`, JSON.stringify([...lookup]));
    await info({ msg, meme });
  } catch (e) {
    if (await fs.promises.access(audioPath)) await fs.unlink(audioPath);
    if (await fs.promises.access(memePath)) await fs.unlink(memePath);
    const memeIndex = memes.findIndex((meme) => meme.name);
    if (memeIndex !== -1) memes.splice(memeIndex, 1);
    [name, ...aliases].forEach((cmd) => lookup.delete(cmd, name));
    throw e;
  }
}
