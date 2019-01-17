import Database, { query } from "/src/index.js"

const stores = {
  friends: "id++,name&,age,profession",
  notebooks: "id,name,content"
}

const db = new Database("test")

db.init(1, stores)

db.friends.add({ name: "Steve", age: 2, profession: "developer" })
db.friends.add({ name: "Roger", age: 2, profession: "developer" })
db.friends.add({ name: "Moore", age: 21, profession: "Doctor" })

db.friends.search({ profession: "developer", age: 2 }).then(result => {
  result.forEach(item => {
    console.log(item)
  })
})

db.friends
  .update({ name: "Steve" })
  .value({ age: 7 })
  .then(result => {
    console.log("Updated", result)
  })

db.friends.search(query`age < ${3}`).then(result => {
  console.log("Age smaller than", result)
})

db.friends.search(query`age > ${3}`).then(result => {
  console.log("Age bigger than", result)
})

db.friends.search().then(result => {
  console.log("All", result)
})

db.friends.delete({ name: "Roger" })
db.friends.delete({ name: "Steve" })
db.friends.delete({ name: "Moore" })
