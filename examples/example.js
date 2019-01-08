import Database from "/src/index.js";

const db = new Database("test")

db.version(1).stores({
  friends: "id,name,age",
  notebooks: "id,name,content"
});

console.log(db);

