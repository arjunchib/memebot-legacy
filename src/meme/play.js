export default async function ({ msg, meme }) {
  const channel = msg.member.voice.channel;
  const conn = await channel.join();
  const dispatcher = conn.play(`./data/audio/${meme.name}.opus`);
  dispatcher.on("finish", () => {
    channel.leave();
    conn.disconnect();
  });
}
