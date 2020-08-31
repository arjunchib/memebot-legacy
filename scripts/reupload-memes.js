import Meme from "../src/structures/Meme.js";
import store from "../src/util/store.js";
import fs from "fs";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function () {
  await Meme.loadAll();
  const memes = [...new Set(Meme.all.values())];
  console.log(`Loaded ${memes.length} meme(s)`);
  await Promise.all(
    memes.map(async (meme, index) => {
      await wait(index * 10);
      const key = `audio/${meme.name}.opus`;
      const audioPath = store.local.path(key);
      return store.remote.save(key, fs.createReadStream(audioPath));
    })
  );
  console.log(`Resaved ${memes.length} meme(s)`);
})();
