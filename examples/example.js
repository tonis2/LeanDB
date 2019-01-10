import Database from "/src/index.js";


const stores = {
  friends: "id,name,age",
  notebooks: "id,name,content"
}

const db = new Database("test")

db.init(1, stores)


db.friends.add({ "name": "Steve", age: 5, id: 1 })
db.friends.add({ "name": "Roger", age: 2, id: 2 })


db.friends.update({name:"Steve"}).value({age:7}).then(result => {
  console.log(result)
})

db.friends.delete({name: "Roger"})
db.friends.delete({name: "Steve"})

db.friends.find({name:"Roger", age:5}).then(result => {
  console.log(result)
})


