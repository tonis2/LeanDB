export default class Database {
  constructor(name) {
    this.name = name;
  }

  version(ver) {
    this.db = window.indexedDB.open(this.name, ver || 1);
    return this;
  }

  async stores(stores_data) {
    this.db.onupgradeneeded = database => {
      Object.entries(stores_data).forEach(entry => {
        const name = entry[0];
        const keys = entry[1].split(",");

        let store = database.createObjectStore(name, { autoIncrement: true });

        keys.forEach(key => store.createIndex(key, key, { unique: true }));
      });
    };

    Object.keys(stores_data).forEach(name => {
      this[name] = async () => {
        await this.db.transaction([name], "readwrite").objectStore(name);
      };
    });
    return this;
  }
}
