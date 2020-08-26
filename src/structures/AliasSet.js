import Meme from "./Meme.js";
import BaseSet from "./BaseSet.js";

export default class AliasSet extends BaseSet {
  constructor(aliases, meme) {
    super();
    aliases.forEach((alias) => this.add(alias));
    this.meme = meme;
  }

  add(alias) {
    if (!Meme.validateCommand(alias)) {
      throw new Error(`Alias ${alias} must be alphanumeric`);
    }
    if (Meme.all.has(alias.toLowerCase())) {
      throw new Error(`Alias ${alias} is already a command`);
    }
    Meme.all.set(alias.toLowerCase(), this.meme);
    super.add(alias);
  }

  delete(alias) {
    Meme.all.delete(alias.toLowerCase());
    super.delete(alias);
  }
}
