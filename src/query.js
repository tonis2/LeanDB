import Transaction from "./transaction.js"

/*
Query class that contains all the quiery functions for your selected database
*/
export default class Query {
  constructor(name, version, db) {
    this.name = name
    this.version = version
    this.db = db
  }

  /*
  Add data to selected database, data is basic object {"key": value}
  */
  async add(data) {
    return new Promise(async (resolve, reject) => {
      const transaction = await new Transaction(this.db, this.name, "readwrite")
      const store = await transaction.objectStore(this.name).put(data)

      store.onerror = event => {
        reject(event.target.error.message)
      }
      store.onsuccess = event => {
        if (this.db.observer) this.db.observer({ method: "add", source: store.source.name, key: event.target.result })
        resolve(event.target.result)
      }
    })
  }

  /*
  Delete data where the query matches, requires query like this {"key":value}
 */
  delete(query) {
    return new Promise(async resolve => {
      const transaction = await new Transaction(this.db, this.name, "readwrite")
      const store = await transaction.objectStore(this.name).openCursor()

      store.onsuccess = event => {
        const cursor = event.target.result

        if (cursor) {
          const matching_query = Object.keys(query)
            .map(key => Object.is(cursor.value[key], query[key]))
            .filter(result => !result)

          if (matching_query.length < 1) {
            cursor.delete()
            if (this.db.observer) this.db.observer({ method: "delete", source: store.source.name, key: cursor.key })
          }
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }

  /*
  Update data where the query matches, requires query like this {"key":value} and data {"key":value}
 */
  update(query) {
    this.value = data => {
      return new Promise(async resolve => {
        const transaction = await new Transaction(this.db, this.name, "readwrite")
        const store = await transaction.objectStore(this.name).openCursor()

        store.onsuccess = event => {
          const cursor = event.target.result
          if (cursor) {
            const matching_query = Object.keys(query)
              .map(key => Object.is(cursor.value[key], query[key]))
              .filter(result => !result)

            if (matching_query.length < 1) {
              cursor.update(Object.assign(cursor.value, data))
              if (this.db.observer) this.db.observer({ method: "update", source: store.source.name, key: cursor.key })
              resolve(cursor.value)
            }
            cursor.continue()
          } else {
            resolve(cursor)
          }
        }
      })
    }
    return this
  }

  async all() {
    return new Promise(async resolve => {
      const transaction = await new Transaction(this.db, this.name, "readwrite")
      const store = await transaction.objectStore(this.name)
      store.getAll().onsuccess = event => {
        resolve(event.target.result)
      }
    })
  }

  /*
   Finds data from your database, different method
  */
  async search(query, count) {
    return new Promise(async resolve => {
      const transaction = await new Transaction(this.db, this.name, "readwrite")
      let store = await transaction.objectStore(this.name)

      if (query && !query.index) {
        const openCursor = store.openCursor()
        const results = []
        openCursor.onsuccess = event => {
          const cursor = event.target.result

          if (cursor) {
            const matching_query = Object.keys(query)
              .map(key => Object.is(cursor.value[key], query[key]))
              .filter(result => !result)

            if (matching_query.length < 1) results.push(cursor.value)
            cursor.continue()
          } else {
            resolve(results)
          }
        }
      }

      if (query && query.index) {
        store = store.index(query.index)
        store.getAll(query.key, count).onsuccess = event => {
          resolve(event.target.result)
        }
      }

      if (!query) {
        store.getAll(null, count).onsuccess = event => {
          resolve(event.target.result)
        }
      }
    })
  }
}
