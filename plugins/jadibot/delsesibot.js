const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

exports.run = {
usage: ['delsesibot'],
category: 'jadibot',
desc: 'Untuk menghapus session jadibot',
async: async (m, { func, mecha, users }) => {
if (!users.jadibot) return m.reply(global.mess.jadibot)
const data = global.db.jadibot.find(x => x.number === m.sender)
if (!data) return m.reply('Data empty.')
const sessionName = data.session;
if (fs.existsSync(sessionName)) {
if (Object.keys(global.jadibot).includes(m.sender)) {
try {
const client = global.jadibot[m.sender];
delete global.jadibot[m.sender];
global.db.jadibot[m.sender].status = false;
await client.end();
await client.logout();
} catch {}
}
rimraf.sync(sessionName);
m.reply('Successfully deleted Jadibot session.')
} else return m.reply('Session jadibot tidak ditemukan!')
},
private: true
}