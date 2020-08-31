import Meme from "../src/structures/Meme.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function () {
  await Meme.loadAll();
  const memes = [...new Set(Meme.all.values())];
  console.log(`Loaded ${memes.length} meme(s)`);
  await Promise.all(
    memes.map(async (meme, index) => {
      await wait(index * 10);
      return meme.save();
    })
  );
  console.log(`Resaved ${memes.length} meme(s)`);
})();
