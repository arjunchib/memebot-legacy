import lookupJSON from "../../lookup.json";

const lookup = new Map(lookupJSON);

export default async function ({ msg, args }) {
  const meme = lookup.get(args[0].toLowerCase());
  const channel = msg.member.voice.channel;
  const conn = await channel.join();
  const dispatcher = conn.play(`./audio/${meme}.opus`);
  dispatcher.on("finish", () => {
    channel.leave();
    conn.disconnect();
  });
}
