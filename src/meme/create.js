import memes from "../memes.js";
import info from "./info.js";
import fs from "fs/promises";

export default async function ({ msg, name }) {
  const meme = {
    name,
    createdAt: new Date(),
    author: {
      name: msg.author.username,
      id: msg.author.id,
    },
    sourceURL: "",
    start: "",
    end: "",
    volume: 1,
    aliases: [],
    tags: [],
  };
  memes.push(meme);
  await fs.writeFile(
    `./memes/${meme.name}.json`,
    JSON.stringify(meme, null, 2)
  );
  await info({ msg, meme });
}
