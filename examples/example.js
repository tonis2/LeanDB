import Database from "/src/index.js";


const stores = {
  friends: "id,name,age",
  notebooks: "id,name,content"
}

const db = new Database("test")

db.init(1, stores)
db.friends.add({ "name": "sitt", age: 5, id: 1 })
db.friends.add({ "name": "jama", age: 2, id: 1 })

db.friends.find({name:"sitt", age:5}).then(result => {
  console.log(result)
})


