import filter from "./filter.js";
import sort from "./sort.js";
import memes from "../memes.js";

const MAX_SEGMENTS = 60;

const segmentMapper = ([name, field]) => {
  const nameStr = name.substring(0, 20).padEnd(20, "\u00A0");
  if (field !== undefined) {
    const fieldStr = field.toString().substring(0, 9).padStart(10, "\u00A0");
    return `\`${nameStr}\u00A0${fieldStr}\``;
  } else {
    return `\`${nameStr}\``;
  }
};

export default async function ({ msg, args, field }) {
  let myMemes = Array.from(memes.values());
  if (args.length === 0) args = ["limit:60", "sort:shuffle"];
  args.forEach((arg) => {
    const listArgs = arg.split(":");
    switch (listArgs[0]) {
      case "filter":
        myMemes = filter({ memes: myMemes, args: listArgs });
        break;
      case "sort":
        myMemes = sort({ memes: myMemes, args: listArgs });
        break;
      case "limit":
        myMemes = myMemes.slice(0, listArgs[1]);
        break;
    }
  });
  const segments = myMemes
    .map((meme) => [meme.name, meme[field]])
    .map(segmentMapper);
  const maxLength = segments[0].length * MAX_SEGMENTS + MAX_SEGMENTS - 1;
  await msg.channel.send(segments.join(" "), {
    split: { char: " ", maxLength },
  });
}
