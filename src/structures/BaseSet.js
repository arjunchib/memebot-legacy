export default class BaseSet extends Set {
  toJSON() {
    return [...this];
  }
}
