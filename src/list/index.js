import filter from "./filter.js";
import sort from "./sort.js";
import Meme from "../structures/Meme.js";
import segment from "../util/segment.js";

const MAX_SEGMENTS = 60;

export default async function ({ msg, args, arg }) {
  const field = arg.length === 2 ? arg[1] : undefined;
  let myMemes = [...new Set(Meme.all.values())];
  if (args.length === 0) args = ["limit:60", "sort:shuffle"];
  args.forEach((arg) => {
    const listArgs = arg.split(":");
    switch (listArgs[0]) {
      case "filter":
        myMemes = filter(myMemes, listArgs);
        break;
      case "sort":
        myMemes = sort(myMemes, listArgs);
        break;
      case "limit":
        myMemes = myMemes.slice(0, listArgs[1]);
        break;
    }
  });
  const segments = myMemes.map((meme) => segment(meme.name, meme[field]));
  const maxLength = segments[0].length * MAX_SEGMENTS + MAX_SEGMENTS - 1;
  await msg.channel.send(segments.join(" "), {
    split: { char: " ", maxLength },
  });
}
