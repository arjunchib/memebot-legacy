import access from "./util/access.js";

const baseCommands = [
  { emoji: ":loud_sound:", msg: "<meme>" },
  { emoji: ":slot_machine:", msg: "random" },
  { emoji: ":mag_right:", msg: "search <meme>" },
  { emoji: ":ledger:", msg: "list" },
  { emoji: ":page_facing_up:", msg: "<meme> info" },
];

const adminCommands = [
  { emoji: ":pencil:", msg: "<meme> <field> <set|add|delete> <value>" },
  {
    emoji: ":cd:",
    msg: "add <sourceURL> <start> <end> <name> [alliases...]",
  },
  { emoji: ":put_litter_in_its_place:", msg: "<meme> delete" },
];

const helpCommand = { emoji: ":question:", msg: "help" };

export default function ({ msg, prefix }) {
  const commands = [
    ...baseCommands,
    ...(access(msg, 1) ? adminCommands : []),
    helpCommand,
  ];
  msg.channel.send(
    commands
      .map((cmd) => `${cmd.emoji} \`${prefix} ${cmd.msg.padEnd(55)}\``)
      .join("\n")
  );
}
