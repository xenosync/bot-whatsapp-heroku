const fetch = require('node-fetch');

exports.run = {
usage: ['listbanned'],
hidden: ['listban'],
category: 'special',
async: async (m, { func, mecha, setting }) => {
const data = Object.values(global.db.users).filter(v => v.banned)
if (data.length == 0) return m.reply('*Empty data.*')
let txt = '乂  *L I S T  B A N N E D*\n'
txt += data.map((v, i) => `\n${i + 1}. @${v.jid.split('@')[0]}\n◦  Expire: ${v.expired.banned === 'PERMANENT' ? 'PERMANENT' : func.expireTime(v.expired.banned)}`).join('\n')
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}