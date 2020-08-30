import access from "../util/access.js";

export default async function ({ msg, meme }) {
  if (!access(msg, 1)) return;
  meme.delete();
  await msg.react("🚮");
}
