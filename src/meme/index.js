import play from "./play.js";
import info from "./info.js";

export default async function ({ msg, args }) {
  if (args.length === 1) {
    play({ msg, args });
  } else {
    switch (args[1]) {
      case "info":
        info({ msg, args });
        break;
    }
  }
}
