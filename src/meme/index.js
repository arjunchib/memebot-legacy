import play from "./play.js";
import info from "./info.js";
import field from "./field.js";
import del from "./delete.js";
import access from "../util/access.js";
import Meme from "../structure/Meme.js";

export default async function ({ msg, args, arg, stats, client }) {
  if (!Meme.all.has(arg[0].toLowerCase())) {
    await msg.react("🚫");
    return;
  }
  const meme = Meme.all.get(arg[0].toLowerCase());
  if (args.length === 0) {
    await play({ msg, meme, stats, client });
  } else {
    const arg = args.shift();
    switch (arg) {
      case "delete":
        if (access(msg, 1)) await del({ msg, meme });
        break;
      case "info":
        await info({ msg, meme });
        break;
      default:
        if (access(msg, 1)) await field({ msg, args, meme, field: arg });
        break;
    }
  }
}
