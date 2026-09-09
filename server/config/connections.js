import mongoose from "mongoose";

const connections = new Map()

// process.env.MONGO_CLUSTER_URI should have NO database name in it, e.g.
// mongodb+srv://user:pass@cluster.mongodb.net

export function getTenantConnection(dbName){
    if(connections.has(dbName)) return connections.get(dbName)

    const uri = `${process.env.MONGO_CLUSTER_URI}/${dbName}?${process.env.MONGO_OPTIONS}`
    const conn = mongoose.createConnection(uri, {maxPoolSize : 5})      /// 5 operation per millisecond

    connections.set(dbName, conn)
    // once tenant count grows: evict(autometically close inactive connection/resource) least-recently-used connections here

    return conn
}

