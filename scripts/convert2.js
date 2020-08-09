import transcode from "../src/util/transcode.js";
import fs from "fs";

(async () => {
  const memeFile = fs.readFileSync("./data/meme-file.txt", {
    encoding: "utf8",
  });
  const lines = memeFile
    .split("\n")
    .filter((line) => line !== "")
    .filter((line) => line.match("motherrussia"));

  for await (let line of lines) {
    try {
      const meme = JSON.parse(line);
      const input = `./data/audio1/${meme.name}.mp3`;
      const output = `./data/audio/${meme.name}.opus`;
      const metadata = await transcode(input, output);
      console.log(metadata);
      const newMeme = {
        name: meme.name,
        createdAt: meme.createdAt,
        author: meme.author,
        sourceURL: "",
        start: "",
        end: "",
        aliases: meme.commands.filter((command) => command !== meme.name),
        tags: meme.tags,
        ...metadata,
      };
      await fs.promises.writeFile(
        `./data/memes/${meme.name}.json`,
        JSON.stringify(newMeme, null, 2)
      );
      console.log(meme.name);
    } catch (e) {
      console.log(line);
      console.error(e);
    }
  }
})();
