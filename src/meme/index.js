import play from "./play.js";
import info from "./info.js";
import field from "./field.js";
import del from "./delete.js";

export default async function ({ msg, args, meme }) {
  if (args.length === 0) {
    await play({ msg, meme });
  } else {
    const arg = args.shift();
    switch (arg) {
      case "delete":
        await del({ msg, meme });
        break;
      case "info":
        await info({ msg, meme });
        break;
      default:
        await field({ msg, args, meme, field: arg });
        break;
    }
  }
}
