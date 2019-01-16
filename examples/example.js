import Database from "/src/index.js"

const stores = {
  friends: "id++,name&,age",
  notebooks: "id,name,content"
}

const db = new Database("test")

db.init(1, stores)

db.friends.add({ name: "Steve", age: 5 })
db.friends.add({ name: "Roger", age: 2 })

db.friends.update({name:"Steve"}).value({age:7}).then(result => {
  console.log(result)
})


db.friends.find({ name: "Roger" }).then(result => {
  console.log(result)
})


db.friends.delete({name: "Roger"})
db.friends.delete({name: "Steve"})

