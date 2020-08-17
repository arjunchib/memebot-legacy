const guilds = new Set();

export default async function ({ msg, meme, stats }) {
  const channel = msg.member.voice.channel;
  const guild = msg.member.guild;
  if (guilds.has(guild.id)) {
    msg.react("🙅");
  } else if (!channel) {
    msg.react("🔇");
  } else {
    guilds.add(guild.id);
    const conn = await channel.join();
    const dispatcher = conn.play(`./data/audio/${meme.name}.opus`);
    dispatcher.on("finish", () => {
      channel.leave();
      conn.disconnect();
    });
    dispatcher.on("close", () => {
      guilds.delete(guild.id);
    });
    await stats.log(meme);
  }
}
