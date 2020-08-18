import access from "../util/access.js";

export default async function ({ msg, meme }) {
  const data = { ...meme };
  if (!access(msg, 1)) delete data.author;
  const output = JSON.stringify(data, null, 2);
  await msg.channel.send(output, { code: "json" });
}
