const fetch = require('node-fetch');

exports.run = {
usage: ['listcmd'],
category: 'special',
async: async (m, { mecha, setting }) => {
const data = Object.entries(global.db.stickercmd)
if (data.length == 0) return m.reply('*Empty data.*')
let txt = `乂  *LIST STICKER CMD*\n`
txt += data.map(([key, v], index) => `\n${index++}. ${v.text}\n◦  Creator: @${v.creator.split('@')[0]}\n◦  Key: ${key}`).join('\n')
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
}
}