import fs from "fs";

const memes = new Map();
fs.readdirSync("./data/memes")
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    const meme = JSON.parse(fs.readFileSync(`./data/memes/${file}`, "utf8"));
    memes.set(meme.name.toLowerCase(), meme);
  });

export default memes;
