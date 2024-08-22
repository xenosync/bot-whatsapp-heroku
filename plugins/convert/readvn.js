const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

exports.run = {
usage: ['readvn'],
hidden: ['rvn'],
use: 'reply viewonce vn',
category: 'convert',
async: async (m, { mecha }) => {
try {
if (/viewOnceMessageV2Extension/i.test(m?.quoted?.mtype)) {
mecha.sendReact(m.chat, '🕒', m.key)
let type = Object.keys(m.quoted.message)[0]
let msg = m.quoted.message[type]
let media = await downloadContentFromMessage(msg, type.replace(/Message/gi, ''))
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
await mecha.sendMessage(m.chat, {audio: buffer, mimetype: 'audio/mpeg', ptt: true}, {quoted: m, ephemeralExpiration: m.expiration})
} else m.reply('Reply view once message to use this command.')
} catch (e) {
m.reply(global.mess.error.api)
}
},
limit: true,
}