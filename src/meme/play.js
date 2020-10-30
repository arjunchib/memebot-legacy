import store from "../util/store.js";

export default async function ({ msg, meme, stats, client }) {
  const connectedGuilds = client.voice.connections.map(
    (vc) => vc.channel.guild
  );
  const channel = msg.member.voice.channel;
  const guild = msg.member.guild;
  if (connectedGuilds.includes(guild)) {
    msg.react("🙅");
    return false;
  } else if (!channel) {
    msg.react("🔇");
    return false;
  } else {
    const conn = await channel.join();
    const dispatcher = conn.play(store.local.path(`audio/${meme.name}.opus`));
    dispatcher.on("finish", () => {
      conn.disconnect();
    });
    await stats.logPlay(meme);
    return true;
  }
}
