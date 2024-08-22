const fetch = require('node-fetch');

exports.run = {
usage: ['listsewa'],
category: 'special',
async: async (m, { func, mecha, setting }) => {
const data = Object.values(global.db.groups).filter(x => x.sewa.status && !isNaN(x.sewa.expired))
if (data.length == 0) return m.reply('*Empty data.*')
let txt = '乂  *L I S T  S E W A*\n'
txt += data.map((v, i) => `\n${i + 1}. ${v.name}\n◦  ID: ${v.jid}\n◦  Expire: ${v.sewa.expired === 'PERMANENT' ? 'PERMANENT' : func.expireTime(v.sewa.expired)}`).join('\n')
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}