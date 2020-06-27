import fs from "fs";

const files = fs.readdirSync("./memes");
files.forEach((fileName) => {
  const file = `./memes/${fileName}`;
  const meme = JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
  const newMeme = {
    name: meme.name,
    createdAt: meme.dateAdded,
    author: {
      name: meme.author,
      id: meme.authorID,
    },
    sourceURL: "",
    start: "",
    end: "",
    volume: Number(meme.audioModifier),
    aliases: meme.commands.filter((command) => command !== meme.name),
    tags: meme.tags,
  };
  fs.writeFileSync(file, JSON.stringify(newMeme, null, 2));
});
