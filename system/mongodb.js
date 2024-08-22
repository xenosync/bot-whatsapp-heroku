const { MongoClient } = require('mongodb')

module.exports = class MongoDB {
constructor(url) {
this._id = 1
this.url = /mongo/.test(url) ? url : ''
this.db = 'database'
this.options = {
useNewUrlParser: true,
useUnifiedTopology: true
}
this.client = new MongoClient(this.url, this.options)
this.connect()
}

exec = async (collect) => {
try {
await this.client.connect()
const db = await this.client.db(this.db).collection(collect)
return db
} catch (e) {
console.log(`System restarted because your mongodb connection error . . .`)
process.exit(1)
}
}

read = async () => {
try {
const json = await (await this.exec('database')).findOne({
_id: this._id
})
if (!json) {
await (await this.exec('database')).insertMany([{
_id: this._id,
data: {}
}])
return ({})
} else {
return json.data
}
} catch (e) {
console.log(`System restarted because your mongodb connection error . . .`)
process.exit(1)
}
}

save = async data => {
try {
const json = await (await this.exec('database')).findOne({
_id: this._id
})
const is_data = data ? data : global.db ? global.db : {}
if (!json) {
await (await this.exec('database')).insertMany([{
_id: this._id,
data: is_data
}])
} else {
const res = await (await this.exec('database')).updateOne({
_id: this._id
}, {
'$set': {
data: is_data
}
})
}
} catch (e) {
console.log(`System restarted because your mongodb connection error . . .`)
process.exit(1)
}
}

connect = async () => {
await this.client.connect().then(_ => console.log('</> Success connect to MongoDb √'));
const db = await this.client.db(this.db)
const data = await (await db.listCollections().toArray()).some(v => v.name == 'data')
if (!data) db.createCollection('data')
}
}