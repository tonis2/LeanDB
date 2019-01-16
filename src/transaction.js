/*
Transaction class that creates a transaction object out of database injected
https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/transaction
*/
export default class Transaction {
  constructor(db, name, type) {
    return this.createTransaction(db, name, type)
  }

  async createTransaction(db, name, type) {
    const database = await db
    const transaction = await database.transaction(name, type)

    return await transaction
  }
}
