export default class Query {
  constructor(name, database) {
    this.add = this.add.bind(this, database, name);
    this.find = this.find.bind(this, database, name);
  }

  async add(database, name, data) {
    return new Promise((resolve, reject) => {
      database.onsuccess = async event => {
        const db = event.target.result;
        const transaction = await db.transaction(name, "readwrite");
        let result = transaction.objectStore(name).put(data);
        result.onerror = error => {
          reject(error);
        };
        result.onsuccess = event => {
          resolve(event.target.result);
        };
      };
    });
  }

  delete(key) {}

  update(key) {}

  find(database, name, query) {
    return new Promise((resolve, reject) => {
      database.onsuccess = async event => {
        const db = event.target.result;
        const transaction = await db.transaction(name, "readwrite");
        let result = transaction.objectStore(name);
        const getCursorRequest = result.openCursor();

        getCursorRequest.onerror = error => {
          reject(error);
        };

        getCursorRequest.onsuccess = event => {
          const cursor = event.target.result;
          if (cursor) {
            const matching_query = Object.keys(query)
              .map(key => Object.is(cursor.value[key], query[key]))
              .filter(result => !result);
            if (matching_query.length < 1) resolve(cursor.value);
            else cursor.continue();
          } else {
            console.log("Exhausted all documents");
          }
        };
      };
    });
  }
}
