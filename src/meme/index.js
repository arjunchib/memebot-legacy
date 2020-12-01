import play from "./play.js";
import info from "./info.js";
import del from "./delete.js";
import field from "./field.js";
import Meme from "../structures/Meme.js";
import access from "../util/access.js";

export default async function ({ msg, args, arg, stats, client }) {
  if (!Meme.all.has(arg[0].toLowerCase())) {
    await msg.react("🚫");
    return;
  }
  const meme = Meme.all.get(arg[0].toLowerCase());
  let context = { msg, meme, stats, client, args };
  if (!access(msg, 1) && meme.private) {
    await msg.react("🚫");
    return
  }
  if (args.length === 0) {
    await play(context);
  } else {
    arg = args.shift();
    context = { ...context, arg };
    switch (arg.toLowerCase()) {
      case "delete":
        await del(context);
        break;
      case "info":
        await info(context);
        break;
      case "source":
        msg.channel.startTyping();
        await meme.source();
        await msg.channel.send(`Sourced ${meme.name}`);
        msg.channel.stopTyping(true);
        break;
      default:
        await field(context);
    }
  }
}
