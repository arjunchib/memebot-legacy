export default async function ({ msg, meme }) {
  await msg.channel.send(JSON.stringify(meme, null, 2), {
    code: "json",
  });
}
