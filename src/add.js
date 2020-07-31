import ytdl from "ytdl-core";
import memes from "./memes.js";
import info from "./meme/info.js";
import fs from "fs";
import lookup from "./lookup.js";
import ffmpeg from "fluent-ffmpeg";

function transcode(input, output, options) {
  const outputOptions = ["-f ogg"];
  if (options.start) outputOptions.push(`-ss ${options.start}`);
  if (options.end) outputOptions.push(`-to ${options.end}`);
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .noVideo()
      .audioCodec("libopus")
      .audioFilters("loudnorm")
      .outputOptions(outputOptions)
      .on("error", (err) => reject(err))
      .on("end", () => resolve())
      .save(output);
  });
}

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
  const audioPath = `./audio/${name}.opus`;
  const memePath = `./memes/${name}.json`;
  try {
    const input = ytdl(sourceURL, { filter: "audioonly" });
    await transcode(input, audioPath, { start, end });
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
    memes.set(name, meme);
    [name, ...aliases].forEach((cmd) => lookup.set(cmd, name));
    await fs.promises.writeFile(memePath, JSON.stringify(meme, null, 2));
    await fs.promises.writeFile(`./lookup.json`, JSON.stringify([...lookup]));
    await info({ msg, meme });
  } catch (e) {
    if (await fs.promises.access(audioPath)) await fs.unlink(audioPath);
    if (await fs.promises.access(memePath)) await fs.unlink(memePath);
    memes.delete(name);
    [name, ...aliases].forEach((cmd) => lookup.delete(cmd));
    throw e;
  }
}
