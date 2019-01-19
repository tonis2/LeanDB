import Query from "./query.js"
import indexDB from "./db.js"
import query from "./parser.js"
import Transaction from "./transaction.js"

export default class Database {
  constructor(name) {
    this.name = name
  }

  async init(version, schema) {
    const updates = async database => {
      const sync_store = await database.createObjectStore("sync", { keyPath: "id", autoIncrement: true })
      sync_store.createIndex("date", "date", { unique: false })

      Object.entries(schema).forEach(async entry => {
        const name = entry[0]
        const keys = entry[1].split(",")
        const auto_increment = /d\++/.test(keys[0])

        // Remove ++ from the key, or else keypath will error
        if (auto_increment) keys[0] = keys[0].replace("++", "")

        const store = await database.createObjectStore(name, { keyPath: keys[0], autoIncrement: auto_increment })

        // Remove & from the key, or else key will error
        keys.forEach(key => {
          const unique = /&/i.test(key)
          if (unique) key = key.replace("&", "")
          store.createIndex(key, key, { unique: unique })
        })
      })
    }

    const db = new indexDB(this.name, version, updates)

    Object.keys(schema).forEach(name => (this[name] = new Query(name, version, db)))

    if (this.observer) {
      db.observer = this.observer
  
      db.save_to_sync = async (method, source, key) => {
        const transaction = await new Transaction(db, "sync", "readwrite")
        const status = { method, source, key, date: new Date().toISOString() }
        await transaction.objectStore("sync").put(status)
        return status
      }

      this["sync"] = new Query("sync", version, db)
    }

    return this
  }
}

export { query }
