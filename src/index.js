import Query from "./query.js"
import indexDB from "./db.js"

export default class Database {
  constructor(name) {
    this.name = name
  }

  async init(version, schema) {
    const db = new indexDB(this.name, this.version, database => {
      Object.entries(schema).forEach(async entry => {
        const name = entry[0]
        const keys = entry[1].split(",")

        let auto_increment = /d\++/.test(keys[0])

        // Remove ++ from the key, or else keypath will error
        if (auto_increment) keys[0] = keys[0].replace("++", "")

        let store = await database.createObjectStore(name, { keyPath: keys[0], autoIncrement: auto_increment })

        // Remove & from the key, or else key will error
        keys.forEach(key => {
          let unique = /&/i.test(key)
          if (unique) key = key.replace("&", "")
          store.createIndex(key, key, { unique: unique })
        })
      })
    })

    Object.keys(schema).forEach(name => (this[name] = new Query(name, version, db)))

    return this
  }
}
