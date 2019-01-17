
const idb_key_range = {
    "<": IDBKeyRange.upperBound,
    ">" : IDBKeyRange.lowerBound,
    "is": IDBKeyRange.only
}   

export default function query(query, value) {
    let joint_query = [...query].join("")
    let regex = /^([a-z]+) ([a-z<>]+)/
    let [, index, key] = joint_query.match(regex)

    return {
        index:index,
        key: idb_key_range[key](value)
    }
}
