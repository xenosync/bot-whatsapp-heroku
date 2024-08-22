const fetch = require('node-fetch');

exports.run = {
usage: ['totaluser'],
category: 'owner',
async: async (m, { func, mecha, setting }) => {
let data = Object.values(global.db.users)
let totalreg = data.filter(user => user.register)
let txt = `Total User: *${data.length}* User\nRegistered: *${totalreg.length}* User\n\n`
txt += data.map((v, i) => `${i + 1}. @${v.jid.split('@')[0]} (${v.register ? 'Yes' : 'No'})`).join('\n')
mecha.sendMessageModify(m.chat, txt, m, {
title: global.header,
body: global.footer,
thumbnail: await (await fetch(setting.cover)).buffer(),
largeThumb: true,
expiration: m.expiration
})
},
owner: true
}