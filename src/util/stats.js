import save from "./save.js";
import fs from "fs";

export default class Stats {
  constructor(client) {
    this.client = client;
    const now = new Date();
    const timestamp = Stats.timestamp(now);
    const file = `./data/stats/${timestamp}.json`;
    if (fs.existsSync(file)) {
      const stats = JSON.parse(fs.readFileSync(file));
      this.guilds = stats.guilds;
      this.playsPerMeme = new Map(Object.entries(stats.playsPerMeme));
      this.playsPerHour = new Map(Object.entries(stats.playsPerHour));
    } else {
      this.guilds = {
        gain: 0,
        loss: 0,
        net: 0,
      };
      this.playsPerMeme = new Map();
      this.playsPerHour = new Map();
    }
    this.lastModifiedAt = null;
  }

  static increment(map, key, step = 1) {
    if (map.has(key)) {
      const value = map.get(key);
      map.set(key, value + step);
    } else {
      map.set(key, step);
    }
  }

  static timestamp(date) {
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  async log(meme) {
    const now = new Date();
    if (this.needsReset(now)) this.reset();
    // Hours must be converted due to objects only having string keys
    Stats.increment(this.playsPerHour, String(now.getUTCHours()));
    Stats.increment(this.playsPerMeme, meme.name);
    this.lastModifiedAt = now;
    await this.save(now);
  }

  async gainGuild() {
    const now = new Date();
    if (this.needsReset(now)) this.reset();
    this.guilds.gain += 1;
    this.guilds.net += 1;
    this.totalGuild();
    this.lastModifiedAt = now;
    await this.save(now);
  }

  async lossGuild() {
    const now = new Date();
    if (this.needsReset(now)) this.reset();
    this.guilds.loss += 1;
    this.guilds.net -= 1;
    this.totalGuild();
    this.lastModifiedAt = now;
    await this.save(now);
  }

  totalGuild() {
    this.guilds.total = this.client.guilds.cache.size;
  }

  async save(date = new Date()) {
    const timestamp = Stats.timestamp(date);
    const data = {
      guilds: this.guilds,
      playsPerHour: Object.fromEntries(this.playsPerHour),
      playsPerMeme: Object.fromEntries(this.playsPerMeme),
    };
    await save(`./data/stats/${timestamp}.json`, data, { pretty: true });
  }

  needsReset(now) {
    const d = this.lastModifiedAt;
    if (d === null) return false;
    const sameDate = d.getUTCDate() === now.getUTCDate();
    const sameMonth = d.getUTCMonth() === now.getUTCMonth();
    const sameYear = d.getUTCFullYear() === now.getUTCFullYear();
    return !(sameDate && sameMonth && sameYear);
  }

  reset() {
    this.guilds.gain = 0;
    this.guilds.loss = 0;
    this.guilds.net = 0;
    this.playsPerMeme.clear();
    this.playsPerHour.clear();
  }
}