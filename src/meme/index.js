import play from "./play.js";
import info from "./info.js";
import field from "./field.js";
import create from "./create.js";

export default async function ({ msg, args, meme, name }) {
  if (args.length === 0) {
    await play({ msg, meme });
  } else {
    const arg = args.shift();
    switch (arg) {
      case "create":
        await create({ msg, name });
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
