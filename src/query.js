import Transaction from "./transaction.js";



/*
Query class that contains all the quiery functions for your selected database
*/
export default class Query {
  constructor(name, version, db) {
    this.name = name;
    this.version = version;
    this.db = db;
  }
  /*
  Add data to selected database, data is basic object {"key": value}
  */
  async add(data) {
    return new Promise(async (resolve, reject) => {
      const transaction = await new Transaction(this.db, this.name, "readwrite");
      let result = transaction.put(data);

      result.onerror = error => {
        reject(error);
      };
      result.onsuccess = event => {
        resolve(event.target.result);
      };
    })
  }

  /*
  Delete data where the query matches, requires query like this {"key":value}
 */
  delete(query) {
    return new Promise(async (resolve) => {
      const transaction = await new Transaction(this.db, this.name, "readwrite");
      transaction.openCursor().onsuccess = event => {
        const cursor = event.target.result;

        if (cursor) {
          const matching_query = Object.keys(query)
            .map(key => Object.is(cursor.value[key], query[key]))
            .filter(result => !result);

          if (matching_query.length < 1) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      }
    })
  }

  /*
  Update data where the query matches, requires query like this {"key":value} and data {"key":value}
 */
  update(query) {
    this.value = (data) => {
      return new Promise(async (resolve) => {
        const transaction = await new Transaction(this.db, this.name, "readwrite");
        transaction.openCursor().onsuccess = event => {
          const cursor = event.target.result;

          if (cursor) {
            const matching_query = Object.keys(query)
              .map(key => Object.is(cursor.value[key], query[key]))
              .filter(result => !result);

            if (matching_query.length < 1) {
              cursor.update(Object.assign(cursor.value, data));
            }
            cursor.continue();
          } else {
            resolve();
          }
        }
      })
    }
    return this
  }

  /*
   Finds data from your database, requires query like this {"key":value}
  */
  async find(query) {
    return new Promise(async (resolve, reject) => {
      const transaction = await new Transaction(this.db, this.name, "readwrite");
      const getCursorRequest = transaction.openCursor();
      const results = [];
      getCursorRequest.onsuccess = event => {
        const cursor = event.target.result;

        if (cursor) {
          const matching_query = Object.keys(query)
            .map(key => Object.is(cursor.value[key], query[key]))
            .filter(result => !result);

          if (matching_query.length < 1) results.push(cursor.value)
          cursor.continue();
        } else {
          resolve(results);
        }
      }

      getCursorRequest.onerror = error => {
        reject(`Failed to apply search in ${this.name}`);
      };
    })
  }
}
