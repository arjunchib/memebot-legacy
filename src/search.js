import segment from "./util/segment.js";
import lookup from "./lookup.js";
import fl from "fastest-levenshtein";

export default async function ({ msg, args }) {
  const needle = args[0];
  const values = [...lookup.keys()]
    .map((name) => [name, fl.distance(needle, name)])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 30);
  const segments = values.map((value) => segment(value[0]));
  await msg.channel.send(segments.join(" "));
}
