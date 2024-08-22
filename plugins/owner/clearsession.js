const path = require('path');
const fs = require('fs');

exports.run = {
usage: ['clearsession'],
hidden: ['csession'],
category: 'owner',
async: async (m, { func, mecha }) => {
let sessions = 'session';
fs.readdir(sessions, (err, files) => {
if (err) return m.reply(String(err));
for (const file of files) {
if (file !== 'creds.json') {
fs.unlink(path.join(sessions, file), err => {
if (err) return m.reply(String(err));
});
}
}
m.reply(`Successfully clear ${files.length - 1} files sessions.`);
});
},
devs: true
}