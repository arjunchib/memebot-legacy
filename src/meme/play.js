const guilds = new Set();

export default async function ({ msg, meme }) {
  const channel = msg.member.voice.channel;
  const guild = msg.member.guild;
  if (guilds.has(guild.id)) {
    msg.react("🙅");
  } else {
    guilds.add(guild.id);
    const conn = await channel.join();
    const dispatcher = conn.play(`./data/audio/${meme.name}.opus`);
    dispatcher.on("finish", () => {
      channel.leave();
      conn.disconnect();
      guilds.delete(guild.id);
    });
  }
}
