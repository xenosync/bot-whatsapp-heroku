exports.run = {
usage: ['quoted'],
hidden: ['q'],
use: 'reply chat',
category: 'group',
async: async (m, { func, mecha }) => {
if (!m.quoted) return m.reply('Reply pesan!')
try {
let msg = await mecha.serializeM(await m.getQuotedObj())
if (!msg.quoted) return m.reply('Pesan yang anda reply tidak mengandung reply!')
await msg.quoted.copyNForward(m.chat, true)
} catch (err) {
m.reply('Maaf terjadi kesalahan!')
}
},
owner: true
}