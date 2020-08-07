const isSnowflake = (id) => /^\d{18}$/.test(id);

export default function (msg, level = -1) {
  switch (level) {
    case 0:
      return (
        isSnowflake(process.env.ADMIN_USER) &&
        msg.author.id === process.env.ADMIN_USER
      );
    case 1:
      return (
        isSnowflake(process.env.ADMIN_GUILD) &&
        msg.member.guild.id === process.env.ADMIN_GUILD
      );
    default:
      return false;
  }
}
