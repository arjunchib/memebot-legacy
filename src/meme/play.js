import lookupJSON from "../../lookup.json";

const lookup = new Map(lookupJSON);

export default async function ({ msg, meme }) {
  const channel = msg.member.voice.channel;
  const conn = await channel.join();
  const dispatcher = conn.play(`./audio/${meme.name}.opus`);
  dispatcher.on("finish", () => {
    channel.leave();
    conn.disconnect();
  });
}
