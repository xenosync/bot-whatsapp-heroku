const fetch = require('node-fetch');

exports.run = {
usage: ['hitstat'],
category: 'special',
async: async (m, { mecha, setting }) => {
let stat = Object.keys(global.db.statistic)
if (stat.length == 0) return m.reply('No command used.')
let sorted = Object.entries(global.db.statistic).sort((a, b) => b[1].hit - a[1].hit)
let prepare = sorted.map(v => v[0])
let show = Math.min(10, prepare.length)
let txt = `乂  *H I T - S T A T*\n\n`
txt += `*“Total command hit statistics are currently ${Object.entries(global.db.statistic).map((v) => v[1].hit).reduce((a, b) => a + b)} Hits.”*\n`
txt += sorted.slice(0, show).map(([name, v], i) => `\n${i + 1}. *Command* :  ${m.prefix + name}
    *Hit* : ${v.hit}
    *Last Hit* : ${(Date.now() - v.lastused).timers()}`).join('\n')
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}