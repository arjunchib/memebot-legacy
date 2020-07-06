import fs from "fs";

const files = fs.readdirSync("./memes");
const memes = files
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(`./memes/${file}`, "utf8")));

export default memes;
