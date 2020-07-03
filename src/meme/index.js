import play from "./play.js";
import info from "./info.js";
import field from "./field.js";

export default async function ({ msg, args, meme }) {
  if (args.length === 1) {
    play({ msg, meme });
  } else {
    const arg = args.unshift();
    switch (arg) {
      case "info":
        info({ msg, meme });
        break;
      case default:
        field({ msg, args, meme, field: arg });
        break;
    }
  }
}
