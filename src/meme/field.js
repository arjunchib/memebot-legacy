import fs from "fs/promises";
import info from "./info.js";

export default async function ({ msg, args, meme, field }) {
  const op = args.shift();
  const value = args.shift();
  switch (op) {
    case "set":
      meme[field] = value;
      break;
    case "add":
      if (!meme[field].includes(value)) {
        meme[field].push(value);
      }
      break;
    case "delete": {
      const index = meme[field].findIndex((entry) => entry === value);
      if (index !== -1) {
        meme[field].splice(index, 1);
      }
      break;
    }
  }
  await fs.writeFile(
    `./memes/${meme.name}.json`,
    JSON.stringify(meme, null, 2)
  );
  await info({ msg, meme });
}
