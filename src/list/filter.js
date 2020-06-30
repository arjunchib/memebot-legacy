export default function ({ memes, args }) {
  const field = args[2];
  const value = args[3];
  switch (args[1]) {
    case "limit":
      return memes.slice(0, Number(args[2]));
      break;
    case "eq":
      return memes.filter((meme) => meme[field] == value);
      break;
    case "gt":
      return memes.filter((meme) => meme[field] > value);
      break;
    case "lt":
      return memes.filter((meme) => meme[field] < value);
      break;
    case "gte":
      return memes.filter((meme) => meme[field] >= value);
      break;
    case "lte":
      return memes.filter((meme) => meme[field] <= value);
      break;
    case "in":
      return memes.filter((meme) => meme[field].includes(value));
      break;
  }
}
