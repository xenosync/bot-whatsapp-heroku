const fs = require('fs');
const path = require('path');

exports.run = {
usage: ['ceksession'],
hidden: ['ceksesi'],
category: 'special',
async: async (m, { func, mecha }) => {
let sessions = global.connection.session;
let dir = fs.readdirSync(sessions), session = 0;
dir.map(v => session += (fs.statSync(path.join(sessions, v))).size);
let txt = `Session Information

- Total Session : ${dir.length} Files
- Size Session : ${session.sizeString()}`
mecha.reply(m.chat, func.texted('monospace', txt), m)
}
}