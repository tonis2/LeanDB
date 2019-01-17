/*
Provides Async wrapper for indexedDB
*/
export default class DB {
  constructor(name, version, upgrade) {
    this.name = name
    this.version = version
    return this.start_database(upgrade)
  }

  start_database(upgrade) {
    const database = indexedDB.open(this.name, this.version || 1)

    return new Promise((resolve, reject) => {
      database.onsuccess = event => resolve(event.target.result)
      database.onerror = event => reject(event.target.result)

      if (upgrade)
        database.onupgradeneeded = event => {
          upgrade(event.target.result)
        }
    })
  }
}

