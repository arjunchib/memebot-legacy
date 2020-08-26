import info from "./info.js";

export default async function (context) {
  const { arg, args, meme } = context;
  switch (arg) {
    case "alias":
      args.forEach((arg) => meme.aliases.add(arg));
      break;
    case "unalias":
      args.forEach((arg) => meme.aliases.delete(arg));
      break;
    case "tag":
      args.forEach((arg) => meme.tags.add(arg));
      break;
    case "untag":
      args.forEach((arg) => meme.tags.delete(arg));
      break;
    case "start":
      meme.start = args[0];
      break;
    case "end":
      meme.end = args[0];
      break;
    case "url":
    case "sourceurl":
      meme.sourceURL = args[0];
      break;
  }
  await Promise.all([meme.save(), info(context)]);
}
