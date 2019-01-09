import Query from "./query.js";
import indexDB from "./db.js";

export default class Database {
  constructor(name) {
    this.name = name;
  }

  async init(version, schema) {
    const db = new indexDB(this.name, this.version, (database) => {
      Object.entries(schema).forEach(async entry => {
        const name = entry[0];
        const keys = entry[1].split(",");

        let store = await database.createObjectStore(name, {
          autoIncrement: true
        });
        keys.forEach(key => store.createIndex(key, key, { unique: false }));
      });
    });

    Object.keys(schema).forEach(name => this[name] = new Query(name, version, db));

    return this;
  }
}
