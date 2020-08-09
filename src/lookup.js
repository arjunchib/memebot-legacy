import memes from "./memes.js";

const lookup = new Map();

memes.forEach((meme) => {
  lookup.set(meme.name.toLowerCase(), meme.name.toLowerCase());
  meme.aliases.forEach((alias) =>
    lookup.set(alias.toLowerCase(), meme.name.toLowerCase())
  );
});

export default lookup;
