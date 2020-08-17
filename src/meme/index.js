import play from "./play.js";
import info from "./info.js";
import field from "./field.js";
import del from "./delete.js";
import access from "../util/access.js";

export default async function ({ msg, args, meme, stats }) {
  if (args.length === 0) {
    await play({ msg, meme, stats });
  } else {
    const arg = args.shift();
    switch (arg) {
      case "delete":
        if (access(msg, 1)) await del({ msg, meme });
        break;
      case "info":
        if (access(msg, 1)) await info({ msg, meme });
        break;
      default:
        if (access(msg, 1)) await field({ msg, args, meme, field: arg });
        break;
    }
  }
}
