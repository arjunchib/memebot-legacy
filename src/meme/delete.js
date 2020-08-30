import access from "../util/access.js";
import store from "../util/store.js";
import Meme from "../structures/Meme.js";

export default async function ({ msg, meme }) {
  if (!access(msg, 1)) return;
  await store.local.remove(`audio/${meme.name}.opus`);
  await store.remove(`memes/${meme.name}.json`);
  Meme.all.delete(meme.name);
  meme.aliases.forEach((alias) => {
    Meme.all.delete(alias);
  });
  await msg.react("🚮");
}
