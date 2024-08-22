const fs = require('fs');
const path = require('path');

module.exports = class Database {
constructor(name) {
this.name = 'database.json';
this.data = {};
this.file = path.join(process.cwd(), 'database', this.name);
}

read = async () => {
let database;
if (fs.existsSync(this.file)) {
database = JSON.parse(fs.readFileSync(this.file))
} else {
fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
database = this.data
}
return database;
}

save = async data => {
this.data = !!data ? data : global.db;
let dirname = path.dirname(this.file)
if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
return this.file
}
}