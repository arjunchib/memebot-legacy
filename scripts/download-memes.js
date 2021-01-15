import store from "../src/util/store.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function () {
    const memesData = await store.remote.load('memes.json')
    let memes = JSON.parse(memesData.Body)
    await Promise.all(
        memes.map(async (meme, index) => {
            await wait(index * 10);
            const key = `audio/${meme.name}.opus`;
            const data = await store.remote.load(key)
            return store.local.save(key, data.Body);
        })
    )
    console.log(`Downloaded ${memes.length} audio file(s)`)
    await Promise.all(
        memes.map(async (meme, index) => {
            await wait(index * 10);
            const key = `memes/${meme.name}.json`;
            const data = await store.remote.load(key)
            return store.local.save(key, data.Body);
        })
    )
    console.log(`Downloaded ${memes.length} data file(s)`)
})();
