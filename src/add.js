import ytdl from "ytdl-core";
import prism from "prism-media";
import memes from "./memes.js";
import info from "./meme/info.js";
import fs from "fs";
import lookup from "./lookup.js";

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
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
  lookup.set(name, name);
  aliases.forEach((alias) => lookup.set(alias, name));
  await fs.promises.writeFile(
    `./memes/${meme.name}.json`,
    JSON.stringify(meme, null, 2)
  );
  await fs.promises.writeFile(`./lookup.json`, JSON.stringify([...lookup]));
  await info({ msg, meme });

  const input = ytdl(sourceURL);
  const transcoder = new prism.FFmpeg({
    args: [
      "-analyzeduration",
      "0",
      "-loglevel",
      "0",
      /*"-f",
      "s16le",
      "-ar",
      "48000",
      "-ac",
      "2",*/
      "-filter:a",
      "loudnorm",
      "-c:a",
      "libopus",
      "-f",
      "ogg",
    ],
  });
  const file = fs.createWriteStream(`./audio/${name}.opus`);

  input.pipe(transcoder).pipe(file);
}
