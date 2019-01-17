
const idb_key_range = {
    "<": IDBKeyRange.upperBound,
    ">" : IDBKeyRange.lowerBound,
    "is": IDBKeyRange.only
}   

export default function query(query, value) {
    let joint_query = [...query].join("")
    let regex = /^(?<index>[a-z]+) (?<key>[a-z<>]+)/
    let params = joint_query.match(regex)

    return {
        index:params.groups.index,
        key: idb_key_range[params.groups.key](value)
    }
}
