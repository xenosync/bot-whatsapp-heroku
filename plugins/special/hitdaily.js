const fetch = require('node-fetch');

exports.run = {
usage: ['hitdaily'],
category: 'special',
async: async (m, { func, mecha, setting }) => {
let hitdaily = Object.entries(global.db.statistic).map((v) => v[1].hittoday).reduce((a, b) => a + b)
if (hitdaily == 0) return m.reply('No command used.')
let txt = `乂  *H I T - D A I L Y*

*“Total command hit statistics for today ${hitdaily} Hits.”*
${Object.entries(global.db.statistic).sort((a, b) => b[1].hittoday - a[1].hittoday).slice(0, 10).map(([name, v], i) => `\n${i + 1}. *Command* : ${m.prefix + name}\n    *Hit* : ${func.formatNumber(v.hittoday)}\n    *Last Hit* : ${(Date.now() - v.lastused).timers()}`).join('\n')}`
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}