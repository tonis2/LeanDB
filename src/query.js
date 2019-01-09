

export default class Query {
  constructor(name, version, db) {
    this.name = name;
    this.version = version;
    this.db = db;
  }

  async add(data) {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const transaction = await db.transaction(this.name, "readwrite");
      let result = await transaction.objectStore(this.name).put(data);
      result.onerror = error => {
        reject(error);
      };
      result.onsuccess = event => {
        resolve(event.target.result);
      };
    })
  }

  delete(key) { }

  update(key) { }

  async find(query) {
    return new Promise( async (resolve, reject) => {
      const db = await this.db;
      const transaction = await db.transaction(this.name, "readwrite");
      let result = await transaction.objectStore(this.name);
      const getCursorRequest = result.openCursor();

      getCursorRequest.onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          const matching_query = Object.keys(query)
            .map(key => Object.is(cursor.value[key], query[key]))
            .filter(result => !result);

          if (matching_query.length < 1) resolve(cursor.value);
          else cursor.continue();
        } else {
          resolve([])
        }
      }

      getCursorRequest.onerror = error => {
        reject(error);
      };
    })
  }
}
