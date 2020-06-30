import lookupJSON from "../../lookup.json";

const lookup = new Map(lookupJSON);

export default async function ({ msg, args }) {
  const name = lookup.get(args[0].toLowerCase());
  const meme = await import(`../../memes/${name}.json`);
  await msg.channel.send(JSON.stringify(meme.default, null, 2), {
    code: "json",
  });
}
