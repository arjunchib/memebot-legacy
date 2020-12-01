import segment from "./util/segment.js";
import Meme from "./structures/Meme.js";
import natural from "natural";
import access from "./util/access.js"

function score(needle, name) {
  const source = needle
  const target = name
  return natural.LevenshteinDistance(source, target, {search: true}).distance
}

export default async function ({ msg, args }) {
  const needle = args[0];
  let values = Meme.getAllCommands(access(msg, 1)).map((name) => [name, score(needle, name)])
  const min = values.reduce((acc, cur) => Math.min(acc,cur[1]), Infinity)
  values = values.filter(val => val[1] === min)
  const segments = values.map((value) => segment(`${value[0]}`));
  await msg.channel.send(segments.join(" "));
}
