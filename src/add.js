import ytdl from "ytdl-core";
import memes from "./util/memes.js";
import info from "./meme/info.js";
import fs from "fs/promises";
import transcode from "./util/transcode.js";
import save from "./util/save.js";

function validateDuration(duration) {
  return (
    /(?:\d{1,2}:)?\d{1,2}:\d{1,2}(?:\.\d{1,4})?/.test(duration) &&
    /\d+(?:\.\d{1,4})?(?:s|ms|us)?/.test(duration)
  );
}

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
  const audioPath = `./data/audio/${name}.opus`;
  const memePath = `./data/memes/${name}.json`;
  if (!ytdl.validateURL(sourceURL)) {
    throw new Error("Invalid source URL");
  }
  if (!validateDuration(start)) {
    throw new Error("Ivalid start time");
  }
  if (!validateDuration(end)) {
    throw new Error("Ivalid end time");
  }
  if (!/[a-zA-Z0-9]/.test(name)) {
    throw new Error("Invalid name");
  }
  aliases.forEach((alias) => {
    if (!/[a-zA-Z0-9]/.test(alias)) {
      throw new Error(`Invalid alias ${alias}`);
    }
  });
  const conflicts = [name, ...aliases].filter((cmd) =>
    memes.has(cmd.toLowerCase())
  );
  if (conflicts.length > 0) {
    throw new Error(`Name or alias alreay exists for ${conflicts.join(", ")}`);
  }
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
    [name, ...aliases].forEach((cmd) => memes.set(cmd.toLowerCase(), meme));
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
    [name, ...aliases].forEach((cmd) => memes.delete(cmd));
    throw e;
  }
}
