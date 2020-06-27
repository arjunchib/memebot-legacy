import fs from "fs";

const files = fs.readdirSync("./memes");
files.forEach((fileName) => {
  const file = `./memes/${fileName}`;
  const meme = JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
  meme.aliases = meme.aliases.filter((alias) => alias !== meme.name);
  fs.writeFileSync(file, JSON.stringify(meme, null, 2));
});
