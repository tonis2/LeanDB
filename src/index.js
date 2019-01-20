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

      //Create sync table manually so we could add data about the changes we have done do the database, useful when syncing to server.
      const sync_store = await database.createObjectStore("sync", { keyPath: "id", autoIncrement: true })
      sync_store.createIndex("date", "date", { unique: false })

      //Loop throught the schema
      Object.entries(schema).forEach(async entry => {

        const name = entry[0]
        const keys = entry[1].split(",")
        const auto_increment = /d\++/.test(keys[0])

        // Remove ++ from the key, or else keypath will error
        if (auto_increment) keys[0] = keys[0].replace("++", "")

        //Create new store for each entry in schema, name equals object key name
        const store = await database.createObjectStore(name, { keyPath: keys[0], autoIncrement: auto_increment })

        //Loop through the schema entry values and create index for each of them like id,name ...etc
        keys.forEach(key => {
          const unique = /&/i.test(key)
          // Remove & from the key, or else key will error
          if (unique) key = key.replace("&", "")
          store.createIndex(key, key, { unique: unique })
        })
      })
    }

    const db = new indexDB(this.name, version, updates)

    //Loop though schema and add query functions for each entry
    Object.keys(schema).forEach(name => (this[name] = new Query(name, version, db)))

    //Add observing settings
    db.observe = this.observe
    db.observer = this.observer
    
    if (this.observe) {
      //This function is used to save database updates to sync table, so data could be sync with server
      db.save_to_sync = async (method, source, key) => {
        this["sync"] = new Query("sync", version, db)
        const transaction = await new Transaction(db, "sync", "readwrite")
        const status = { method, source, key, date: new Date().toISOString() }
        await transaction.objectStore("sync").put(status)
        return status
      }
    }

    return this
  }
}

export { query }
