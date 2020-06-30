import fs from "fs/promises";
import filter from "./filter.js";
import sort from "./sort.js";

export default async function ({ msg, args }) {
  // Read memes
  const files = await fs.readdir("./memes");
  const promises = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => fs.readFile(`./memes/${file}`, "utf8"))
    .map((promise) => promise.then(JSON.parse));
  let memes = await Promise.all(promises);

  // Create list
  let field;
  args.forEach((arg) => {
    const listArgs = arg.split(":");
    switch (listArgs[0]) {
      case "list":
        if (listArgs.length > 1) field = listArgs[1];
        break;
      case "filter":
        memes = filter({ memes, args: listArgs });
        break;
      case "sort":
        memes = sort({ memes, args: listArgs });
        break;
    }
  });

  // Send list
  const list =
    field === undefined
      ? memes.map((meme) => meme.name)
      : memes.reduce((acc, meme) => {
          acc[meme.name] = meme[field];
          return acc;
        }, {});
  const output = `\`\`\`json\n${JSON.stringify(list)}\`\`\``;
  const append = Array.isArray(list) ? "]```" : "}```";
  const prepend = Array.isArray(list) ? "```json\n[" : "```json\n{";
  await msg.channel.send(output, { split: { char: ",", append, prepend } });
}
