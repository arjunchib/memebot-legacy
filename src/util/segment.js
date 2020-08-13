export default function (name, field) {
  const nameStr = name.substring(0, 20).padEnd(20, "\u00A0");
  if (field !== undefined) {
    const fieldStr = field.toString().substring(0, 9).padStart(10, "\u00A0");
    return `\`${nameStr}\u00A0${fieldStr}\``;
  } else {
    return `\`${nameStr}\``;
  }
}
