import fs from "fs";

const lookup = new Map();
const files = fs
  .readdirSync("./memes")
  .filter((file) => file.endsWith(".json"));
files.forEach((fileName) => {
  try {
    const file = `./memes/${fileName}`;
    const meme = JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
    lookup.set(meme.name.toLowerCase(), meme.name.toLowerCase());
    meme.aliases.forEach((alias) => {
      lookup.set(alias.toLowerCase(), meme.name.toLowerCase());
    });
  } catch (e) {
    console.log(`Error in ${filename}`);
    throw e;
  }
});

console.log(JSON.stringify([...lookup]));
fs.writeFileSync("./lookup.json", JSON.stringify([...lookup]));
