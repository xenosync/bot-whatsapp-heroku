const fs = require('fs'),
path = require('path'),
fetch = require('node-fetch');

exports.run = {
usage: ['dashboard'],
hidden: ['dash'],
category: 'special',
async: async (m, { func, mecha, setting }) => {
let sessions = 'session';
let dir = fs.readdirSync(sessions), session = 0;
dir.map(v => session += (fs.statSync(path.join(sessions, v))).size);
let sizedb = fs.statSync('./database/database.json').size;
let topFitur = Object.entries(global.db.statistic).sort((a, b) => b[1].hit - a[1].hit);
let txt = `乂  *DASHBOARD MECHA BOT*

⭝ Runtime : ${func.clockString(process.uptime() * 1000)}
⭝ System OS : ${process.platform + " " + process.arch}
⭝ Nodejs Version : ${process.version}
⭝ Total Session : ${dir.length} Files
⭝ Size Session : ${session.sizeString()}
⭝ Size Database : ${sizedb.sizeString()}
⭝ Ram Used Bot : ${process.memoryUsage.rss().sizeString(0)}
⭝ Max Ram Server : ${process.env.SERVER_MEMORY ?? 0} MB
⭝ Time Server : ${process.env.TZ ?? 'Tidak diketahui'}
⭝ Location Server : ${process.env.P_SERVER_LOCATION ?? "Tidak diketahui"}
⭝ Total Hit Bot : ${Object.entries(global.db.statistic).map((v) => v[1].hit).reduce((a, b) => a + b)}
⭝ Total Database User : ${Object.keys(global.db.users).length} Users
⭝ Total Database Group : ${Object.keys(global.db.groups).length} Groups
⭝ Total Sampah : ${fs.readdirSync('./sampah').filter(v => ['gif', 'png', 'mp3', 'm4a', 'opus', 'mp4', 'jpg', 'jpeg', 'webp', 'webm'].some(x => v.endsWith(x))).map(v => v).length} Sampah
⭝ Top Fitur :\n${topFitur.slice(0, 10).map(([name, v], i) => '\n' + (i + 1) + '. *Command* :  ' + m.prefix + name + '\n    *Hit* : ' + func.formatNumber(v.hit) + '\n    *Last Used* : ' + (Date.now() - v.lastused).timers()).join('\n')}`
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}