export default function ({ msg, prefix }) {
  const message = `${prefix} list ➡️ List 60 random memes
${prefix} <meme> ➡️ Play a meme
${prefix} <meme> info ➡️ Display info on a meme
${prefix} help ➡️ Show this message`;
  msg.channel.send(`\`\`\`${message}\`\`\``);
}
