import Query from "./query.js";

export default class Database {
  constructor(name) {
    this.name = name;
  }

  init(ver, schema) {
    const db = window.indexedDB.open(this.name, ver || 1);

    db.onupgradeneeded = this.applyStore.bind(this, schema);

    Object.keys(schema).forEach(name => this[name] = new Query(name, db));

    return this;
  }

  success(schema, event) {
    const database = event.target.result
  }

  async applyStore(schema, event) {
    const database = event.target.result
    Object.entries(schema).forEach(async entry => {
      const name = entry[0];
      const keys = entry[1].split(",");

      let store = await database.createObjectStore(name, {
        autoIncrement: true
      });
      keys.forEach(key => store.createIndex(key, key, { unique: false }));

    });
  }
}
