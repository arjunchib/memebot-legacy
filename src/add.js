import ytdl from "ytdl-core";
import memes from "./memes.js";
import info from "./meme/info.js";
import fs from "fs/promises";
import lookup from "./lookup.js";
import transcode from "./util/transcode.js";
import save from "./util/save.js";

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
  const audioPath = `./data/audio/${name}.opus`;
  const memePath = `./data/memes/${name}.json`;
  try {
    msg.channel.startTyping();
    const input = ytdl(sourceURL, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const metadata = await transcode(input, audioPath, { start, end });
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
      aliases,
      tags: [],
      ...metadata,
    };
    memes.set(name, meme);
    [name, ...aliases].forEach((cmd) => lookup.set(cmd, name));
    await save(memePath, meme, { pretty: true });
    msg.channel.stopTyping(true);
    await info({ msg, meme });
  } catch (e) {
    try {
      await fs.unlink(audioPath);
      await fs.unlink(memePath);
    } catch {
      // Do nothing as the file was likely never created
    }
    memes.delete(name);
    [name, ...aliases].forEach((cmd) => lookup.delete(cmd));
    throw e;
  }
}
