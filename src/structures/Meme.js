import ytdl from "ytdl-core";
import AliasSet from "./AliasSet.js";
import BaseSet from "./BaseSet.js";
import store from "../util/store.js";
import audio from "../util/audio.js";
import fs from "fs";
import mkdirp from "mkdirp";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

mkdirp.sync(store.local.path("audio"));
mkdirp.sync(store.local.path("memes"));

export default class Meme {
  constructor(data) {
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.author = data.author;
    if (data.sourceURL) this.sourceURL = data.sourceURL;
    if (data.start) this.start = data.start;
    if (data.end) this.end = data.end;
    this.aliases = new AliasSet(data.aliases || [], this);
    this.tags = new BaseSet(data.tags || []);
    if (data.duration) this.duration = data.duration;
    if (data.loudness) this.loudness = data.loudness;
    const commands = [this.name, ...this.aliases.values()];
    commands.forEach((cmd) => Meme.all.set(cmd.toLowerCase(), this));
    this.private = data.private || false;
  }

  set name(name) {
    if (!Meme.validateCommand(name)) {
      throw new Error(`Meme name ${name} must be alphanumeric`);
    }
    if (Meme.all.has(name)) {
      throw new Error(`Meme name ${name} is already a command`);
    }
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set sourceURL(url) {
    // Should fix this but idgaf
    // if (!ytdl.validateURL(url)) {
    //   throw new Error("Source URL must be a valid youtube URL");
    // }
    this._sourceURL = url;
  }

  get sourceURL() {
    return this._sourceURL;
  }

  set start(duration) {
    if (!Meme.validateDuration(duration)) {
      throw new Error("Start time must be a valid ffmpeg duration");
    }
    this._start = duration;
  }

  get start() {
    return this._start;
  }

  set end(duration) {
    if (!Meme.validateDuration(duration)) {
      throw new Error("End time must be a valid ffmpeg duration");
    }
    this._end = duration;
  }

  get end() {
    return this._end;
  }

  toJSON() {
    const copy = {};
    Object.keys(this).forEach((key) => {
      if (key.startsWith("_")) {
        copy[key.slice(1)] = this[key];
      } else {
        copy[key] = this[key];
      }
    });
    return copy;
  }

  async source() {
    const key = `audio/${this.name}.opus`;
    const audioPath = store.local.path(key);
    const tempPath = store.local.path("temp");
    const input = audio.source.youtube(this.sourceURL);
    await pipeline(input, fs.createWriteStream(tempPath));
    const { loudness } = await audio.analyze(tempPath, {
      start: this.start,
      end: this.end,
    });
    const metadata = await audio.transcode(tempPath, audioPath, {
      start: this.start,
      end: this.end,
      loudness,
    });
    this.duration = metadata.duration;
    this.loudness = metadata.loudness;
    await Promise.all([
      store.remote.save(key, fs.createReadStream(audioPath)),
      store.local.remove("temp"),
      this.save(),
    ]);
  }

  async save() {
    const key = `memes/${this.name}.json`;
    const censor = (key, value) => {
      if (key === "author") return undefined;
      else return value;
    };
    const memes = [...new Set(Meme.all.values())];
    await Promise.all([
      store.local.save(key, JSON.stringify(this, null, 2)),
      store.remote.save(key, JSON.stringify(this, censor, 2)),
      store.remote.save("memes.json", JSON.stringify(memes, censor)),
    ]);
  }

  async delete() {
    [this.name, ...this.aliases].forEach((cmd) => Meme.all.delete(cmd));
    await Promise.all([
      store.remove(`memes/${this.name}.json`),
      store.remove(`audio/${this.name}.opus`),
    ]);
  }
}

Meme.validateDuration = (duration) => {
  return (
    /(?:\d{1,2}:)?\d{1,2}:\d{1,2}(?:\.\d{1,4})?/.test(duration) ||
    /\d+(?:\.\d{1,4})?(?:s|ms|us)?/.test(duration)
  );
};

Meme.validateCommand = (cmd) => {
  return /[a-zA-Z0-9]*/.test(cmd);
};

Meme.load = async (name) => {
  const data = await store.load(`memes/${name}`);
  return new Meme(data);
};

Meme.loadAll = async () => {
  const data = await store.loadAll("memes");
  return data.map((datum) => new Meme(datum));
};

Meme.getAll = (includePrivate = false) => {
  return [...new Set(Meme.all.values())].filter(
    (meme) => includePrivate || !meme.private
  );
};

Meme.getAllCommands = (includePrivate = false) => {
  const memes = Meme.getAll(includePrivate);
  return memes.reduce((acc, meme) => [meme.name, ...meme.aliases, ...acc], []);
};

Meme.all = new Map();
