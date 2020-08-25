import info from "./meme/info.js";
import Meme from "./structures/Meme.js";

export default async function ({ msg, args }) {
  const [sourceURL, start, end, name, ...aliases] = args;
  msg.channel.startTyping();
  const meme = new Meme({
    name,
    createdAt: new Date(),
    author: {
      name: msg.author.username,
      id: msg.author.id,
    },
    sourceURL,
    start,
    end,
    aliases,
  });
  await meme.source();
  await meme.save();
  msg.channel.stopTyping(true);
  await info({ msg, meme });
}
