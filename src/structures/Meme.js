import ytdl from "ytdl-core";
import AliasSet from "./AliasSet.js";
import BaseSet from "./BaseSet.js";
import transcode from "../util/transcode.js";
import store from "../util/store.js";

export default class Meme {
  constructor(data) {
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.author = data.author;
    if (this.sourceURL) this.sourceURL = data.sourceURL;
    if (this.start) this.start = data.start;
    if (this.end) this.end = data.end;
    this.aliases = new AliasSet(data.aliases || [], this);
    this.tags = new BaseSet(data.tags || []);
    if (this.duration) this.duration = data.duration;
    if (this.loudness) this.loudness = data.loudness;
    const commands = [this.name, ...this.aliases.values()];
    commands.forEach((cmd) => Meme.all.set(cmd.toLowerCase(), this));
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
    if (!ytdl.validateURL(url)) {
      throw new Error("Source URL must be a valid youtube URL");
    }
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
    console.log(copy);
    return copy;
  }

  async source() {
    const audioPath = `./data/audio/${this.name}/.opus`;
    const input = ytdl(this.sourceURL, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const metadata = await transcode(input, audioPath, {
      start: this.start,
      end: this.end,
    });
    this.duration = metadata.duration;
    this.loudness = metadata.loudness;
  }

  async save() {
    await store.save(`memes/${this.name}`, this);
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

Meme.all = new Map();
