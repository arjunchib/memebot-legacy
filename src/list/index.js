import filter from "./filter.js";
import sort from "./sort.js";
import Meme from "../structures/Meme.js";
import segment from "../util/segment.js";
import access from "../util/access.js"

const MAX_MEMES = 60;

export default async function ({ msg, args, arg }) {
  const field = arg.length === 2 ? arg[1] : undefined;
  let myMemes = Meme.getAll(access(msg, 1));
  if (args.length === 0) args = ["sort:shuffle"];
  args.forEach((arg) => {
    const listArgs = arg.split(":");
    switch (listArgs[0]) {
      case "filter":
        myMemes = filter(myMemes, listArgs);
        break;
      case "sort":
        myMemes = sort(myMemes, listArgs);
        break;
    }
  });
  myMemes = myMemes.slice(0, MAX_MEMES);
  const segments = myMemes.map((meme) => segment(meme.name, meme[field]));
  await msg.channel.send(segments.join(" "));
}
