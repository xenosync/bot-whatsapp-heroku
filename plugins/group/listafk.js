const fetch = require('node-fetch');

exports.run = {
usage: ['listafk'],
category: 'group',
async: async (m, { func, mecha, setting }) => {
const data = Object.values(global.db.users).filter(v => v.afk > 0)
if (data.length == 0) return m.reply('Data kosong.')
let txt = `乂  *LIST USER AFK*\nTotal : *${data.length}*\n`
txt += data.map((v, i) => `\n${i + 1}. @${v.jid.split('@')[0]}\n◦  Reason: ${v.alasan ?? 'tanpa alasan'}\n◦  Selama: ${func.clockString(Date.now() - v.afk)}`).join('\n')
mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
})
},
group: true
}