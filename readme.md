### Lean indexedDB using library
-----


Want to use indexedDB in browser but the API seems too hard to manage ? 

LeanDB will help you here, it provides easy to use API, small JavaScript footprint and if fully dependency free.

![gzip size](http://img.badgesize.io/https://unpkg.com/leandb@latest/build/leandb.esm.js?compression=gzip)


#### Add database to your project 

```
npm install leandb --save
```

or in modern browsers


```JS
import Database from "https://unpkg.com/leandb@latest/build/leandb.esm.js"

```


 #### Initialize

Store properties

* `++` : <strong>Auto incrementation</strong>
* `&` : <strong>Must be unique value</strong>



```JS
const stores = {
  friends: "id++,name&,age",
  notebooks: "id,name,content"
}

const db = new Database("test")

db.init(1, stores)

```


#### Add data

```JS
db.friends.add({ "name": "Steve", age: 5, id: 1 })
db.friends.add({ "name": "Roger", age: 2, id: 2 })

```

 #### Update data with new value where query matches

```JS
db.friends.update({name:"Steve"}).value({age:7}).then(result => {
  console.log(result)
})

```

#### Delete data where query matches

```JS
db.friends.delete({name: "Roger"})
```

#### Find data where query matches

```JS
db.friends.find({name:"Roger", age:5}).then(result => {
  console.log(result)
})

const data = await db.friends.find({name:"Steve"})

console.log(data)
```
