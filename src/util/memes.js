import fs from "fs";

const memes = new Map();
fs.readdirSync("./data/memes")
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    const meme = JSON.parse(fs.readFileSync(`./data/memes/${file}`, "utf8"));
    const commands = [meme.name, ...meme.aliases];
    commands.forEach((cmd) => memes.set(cmd.toLowerCase(), meme));
  });

export default memes;
