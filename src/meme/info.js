import access from "../util/access.js";

export default async function ({ msg, meme }) {
  const data = { ...meme.toJSON() };
  if (!access(msg, 1)) delete data.author;
  if (!access(msg, 1)) delete data.private;
  const output = JSON.stringify(data, null, 2);
  await msg.channel.send(output, { code: "json" });
}
