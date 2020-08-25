import access from "../util/access.js";
import store from "../util/store.js";

export default async function ({ msg, meme }) {
  if (!access(msg, 1)) return;
  await store.local.delete(`audio/${meme.name}.opus`);
  await store.delete(`memes/${meme.name}.json`);
  await msg.react("🚮");
}
