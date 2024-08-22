exports.run = {
usage: ['listblock'],
category: 'owner',
async: async (m, { func, mecha, setting }) => {
let listblock = await mecha.fetchBlocklist().catch((_) => []);
if (listblock.length == 0) return m.reply('Empty data.')
let txt = '乂  *L I S T - B L O C K*\n\n'
txt += `Total: *${listblock.length}* blocked\n\n`
txt += listblock.map((v, i) => `${i + 1}. @${v.replace(/@.+/, '')}`).join('\n')
await (setting.fakereply ? mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true, 
expiration: m.expiration
}) : m.reply(txt))
},
owner: true
}