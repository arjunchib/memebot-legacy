import play from "./play.js";
import info from "./info.js";
import del from "./delete.js";
import Meme from "../structure/Meme.js";

export default async function ({ msg, args, arg, stats, client }) {
  if (!Meme.all.has(arg[0].toLowerCase())) {
    await msg.react("🚫");
    return;
  }
  const meme = Meme.all.get(arg[0].toLowerCase());
  const context = { msg, meme, stats, client };
  if (args.length === 0) {
    await play(context);
  } else {
    const arg = args.shift();
    switch (arg) {
      case "delete":
        await del(context);
        break;
      case "info":
        await info(context);
        break;
    }
  }
}
