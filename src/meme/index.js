import play from "./play.js";
import info from "./info.js";
import field from "./field.js";

export default async function ({ msg, args, meme }) {
  if (args.length === 0) {
    play({ msg, meme });
  } else {
    const arg = args.shift();
    switch (arg) {
      case "info":
        info({ msg, meme });
        break;
      default:
        field({ msg, args, meme, field: arg });
        break;
    }
  }
}
