const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

exports.run = {
usage: ['readviewonce'],
hidden: ['rvo'],
use: 'reply viewonce',
category: 'convert',
async: async (m, { func, mecha }) => {
try {
if (/viewOnceMessageV2/i.test(m?.quoted?.mtype)) {
mecha.sendReact(m.chat, '🕒', m.key)
let type = Object.keys(m.quoted.message)[0]
let msg = m.quoted.message[type]
let media = await downloadContentFromMessage(msg, type.replace(/Message/gi, ''))
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
if (/video/.test(type)) {
await mecha.sendMessage(m.chat, {
video: buffer, 
caption: msg.caption || '', 
mentions: mecha.ments(msg.caption)
})
} else if (/image/.test(type)) {
await mecha.sendMessage(m.chat, {
image: buffer, 
caption: msg.caption || '', 
mentions: mecha.ments(msg.caption)
})
}
} else m.reply('Reply view once message to use this command.')
} catch (e) {
m.reply(global.mess.error.api)
}
},
limit: true,
}